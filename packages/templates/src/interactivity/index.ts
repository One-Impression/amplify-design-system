import { stepperJS } from './stepper';
import { scrollJS } from './scroll';

const interactivityMap: Record<string, string> = {
  stepper: stepperJS,
  scroll: scrollJS,
};

export function getInteractivityJS(layout: string): string {
  return interactivityMap[layout] || stepperJS;
}
