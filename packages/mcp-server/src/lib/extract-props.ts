import { readFileSync } from 'node:fs';

export interface ComponentPropDef {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: string;
  enumValues?: string[];
}

export interface ExtractedComponent {
  name: string;
  filePath: string;
  variants?: string[];
  sizes?: string[];
  props: ComponentPropDef[];
  hasForwardRef: boolean;
  subcomponents: string[];
}

const TYPE_ALIAS_RE = /export\s+type\s+(\w+)\s*=\s*([^;]+);/g;
const INTERFACE_RE = /export\s+interface\s+(\w+Props)(?:\s+extends\s+[^{]+)?\s*\{([^}]*)\}/s;
const PROP_LINE_RE = /^\s*(\w+)(\??):\s*([^;]+);?\s*$/;
const FORWARD_REF_RE = /React\.forwardRef\s*</;
const SUBCOMPONENT_RE = /export\s+(?:const|function)\s+(\w+(?:Header|Title|Description|Content|Footer|Body|Item|Trigger|Group))/g;
const DEFAULT_VALUE_RE = /(\w+)\s*=\s*([^,\n}]+?)(?:[,\n}])/g;

const extractEnumValues = (typeBody: string): string[] | undefined => {
  const stripped = typeBody.trim();
  if (!stripped.includes('|')) return undefined;
  const values = stripped.split('|').map((v) => v.trim().replace(/^['"]|['"]$/g, ''));
  if (values.every((v) => /^[\w-]+$/.test(v))) return values;
  return undefined;
};

export const extractFromSource = (filePath: string, componentName: string): ExtractedComponent => {
  const source = readFileSync(filePath, 'utf8');

  const aliases = new Map<string, string[]>();
  let aliasMatch: RegExpExecArray | null;
  TYPE_ALIAS_RE.lastIndex = 0;
  while ((aliasMatch = TYPE_ALIAS_RE.exec(source)) !== null) {
    const [, name, body] = aliasMatch;
    const enumValues = extractEnumValues(body);
    if (enumValues) aliases.set(name, enumValues);
  }

  const variants = aliases.get(`${componentName}Variant`);
  const sizes = aliases.get(`${componentName}Size`);

  const props: ComponentPropDef[] = [];
  const interfaceMatch = INTERFACE_RE.exec(source);
  if (interfaceMatch) {
    const body = interfaceMatch[2];
    for (const line of body.split('\n')) {
      const propMatch = PROP_LINE_RE.exec(line);
      if (!propMatch) continue;
      const [, name, optional, type] = propMatch;
      const enumValues = aliases.get(type.trim()) ?? extractEnumValues(type);
      props.push({
        name,
        type: type.trim(),
        optional: optional === '?',
        enumValues,
      });
    }
  }

  const defaultsBlockMatch = source.match(/\(\s*\{([^}]+?)\},\s*ref\s*\)/s);
  if (defaultsBlockMatch) {
    const defaultsBlock = defaultsBlockMatch[1];
    DEFAULT_VALUE_RE.lastIndex = 0;
    let dvMatch: RegExpExecArray | null;
    while ((dvMatch = DEFAULT_VALUE_RE.exec(defaultsBlock)) !== null) {
      const [, name, value] = dvMatch;
      const prop = props.find((p) => p.name === name);
      if (prop) prop.defaultValue = value.trim().replace(/^['"]|['"]$/g, '');
    }
  }

  const subcomponents: string[] = [];
  SUBCOMPONENT_RE.lastIndex = 0;
  let subMatch: RegExpExecArray | null;
  while ((subMatch = SUBCOMPONENT_RE.exec(source)) !== null) {
    if (subMatch[1] !== componentName) subcomponents.push(subMatch[1]);
  }

  return {
    name: componentName,
    filePath,
    variants,
    sizes,
    props,
    hasForwardRef: FORWARD_REF_RE.test(source),
    subcomponents,
  };
};
