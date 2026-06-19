import React, { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text as RNText,
  View,
} from "react-native";
import { resolveRadius } from "../../theme/resolvers";

/**
 * DateField — a tappable date input with a self-contained, pure-JS calendar
 * popover (no native date-picker module, so it renders in any RN/Expo client
 * without a prebuild). The field shows the selected date (or a placeholder) and
 * a label/helper/error in the same visual grammar as `Input`; tapping it opens a
 * month-grid calendar with month arrows + a year list (so a far-back date like a
 * DOB is reachable in a couple of taps). The value is an ISO `YYYY-MM-DD` string.
 */
export interface DateFieldProps {
  label?: string;
  /** ISO `YYYY-MM-DD`. */
  value?: string;
  placeholder?: string;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  /** ISO `YYYY-MM-DD` lower bound (inclusive). Days before are not selectable. */
  minDate?: string;
  /** ISO `YYYY-MM-DD` upper bound (inclusive). Days after are not selectable. */
  maxDate?: string;
  onChange: (iso: string) => void;
  /** Called when the picker opens — use to mark the field touched. */
  onOpen?: () => void;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const pad = (n: number): string => (n < 10 ? `0${n}` : `${n}`);
const toIso = (y: number, m: number, d: number): string =>
  `${y}-${pad(m + 1)}-${pad(d)}`;

interface Ymd {
  y: number;
  m: number; // 0-11
  d: number;
}

function parseIso(iso?: string): Ymd | null {
  if (!iso) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  return { y: Number(match[1]), m: Number(match[2]) - 1, d: Number(match[3]) };
}

function formatDisplay(iso: string): string {
  const p = parseIso(iso);
  if (!p) return iso;
  return `${p.d} ${MONTHS_SHORT[p.m]} ${p.y}`;
}

/** ISO-string compare works lexically for `YYYY-MM-DD`. */
function isOutOfRange(iso: string, minDate?: string, maxDate?: string): boolean {
  if (minDate && iso < minDate) return true;
  if (maxDate && iso > maxDate) return true;
  return false;
}

function Calendar({
  value,
  minDate,
  maxDate,
  onSelect,
}: {
  value?: string;
  minDate?: string;
  maxDate?: string;
  onSelect: (iso: string) => void;
}): React.ReactElement {
  // Open on the selected date, else the max bound (DOB lands near "today"), else
  // the min bound, else the current month.
  const anchor =
    parseIso(value) ?? parseIso(maxDate) ?? parseIso(minDate) ?? (() => {
      const now = new Date();
      return { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
    })();
  const [viewY, setViewY] = useState(anchor.y);
  const [viewM, setViewM] = useState(anchor.m);
  const [yearOpen, setYearOpen] = useState(false);

  const selected = parseIso(value);

  const cells = useMemo(() => {
    const firstWeekday = new Date(viewY, viewM, 1).getDay();
    const daysInMonth = new Date(viewY, viewM + 1, 0).getDate();
    const out: (number | null)[] = [];
    for (let i = 0; i < firstWeekday; i += 1) out.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) out.push(d);
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [viewY, viewM]);

  const stepMonth = (delta: number): void => {
    let m = viewM + delta;
    let y = viewY;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setViewM(m);
    setViewY(y);
  };

  // Year list bounds — derive from min/max when present, else a sensible window.
  const minYear = parseIso(minDate)?.y ?? 1920;
  const maxYear = parseIso(maxDate)?.y ?? new Date().getFullYear();
  const years = useMemo(() => {
    const out: number[] = [];
    for (let y = maxYear; y >= minYear; y -= 1) out.push(y);
    return out;
  }, [minYear, maxYear]);

  if (yearOpen) {
    return (
      <View>
        <RNText style={styles.calTitle}>Select year</RNText>
        <ScrollView style={styles.yearScroll}>
          <View style={styles.yearGrid}>
            {years.map((y) => (
              <Pressable
                key={y}
                style={[styles.yearCell, y === viewY && styles.yearCellActive]}
                onPress={() => {
                  setViewY(y);
                  setYearOpen(false);
                }}
              >
                <RNText
                  style={[styles.yearText, y === viewY && styles.yearTextActive]}
                >
                  {y}
                </RNText>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.calHeader}>
        <Pressable onPress={() => stepMonth(-1)} hitSlop={8} style={styles.navBtn}>
          <RNText style={styles.navText}>‹</RNText>
        </Pressable>
        <Pressable onPress={() => setYearOpen(true)} hitSlop={6}>
          <RNText style={styles.calTitle}>
            {MONTHS[viewM]} {viewY} ▾
          </RNText>
        </Pressable>
        <Pressable onPress={() => stepMonth(1)} hitSlop={8} style={styles.navBtn}>
          <RNText style={styles.navText}>›</RNText>
        </Pressable>
      </View>
      <View style={styles.weekRow}>
        {WEEKDAYS.map((w) => (
          <RNText key={w} style={styles.weekday}>
            {w}
          </RNText>
        ))}
      </View>
      <View style={styles.grid}>
        {cells.map((d, i) => {
          if (d === null) return <View key={`b${i}`} style={styles.dayCell} />;
          const iso = toIso(viewY, viewM, d);
          const disabled = isOutOfRange(iso, minDate, maxDate);
          const isSel =
            !!selected &&
            selected.y === viewY &&
            selected.m === viewM &&
            selected.d === d;
          return (
            <Pressable
              key={iso}
              disabled={disabled}
              style={styles.dayCell}
              onPress={() => onSelect(iso)}
            >
              <View style={[styles.dayInner, isSel && styles.dayInnerActive]}>
                <RNText
                  style={[
                    styles.dayText,
                    isSel && styles.dayTextActive,
                    disabled && styles.dayTextDisabled,
                  ]}
                >
                  {d}
                </RNText>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function DateField({
  label,
  value,
  placeholder,
  error = false,
  helperText,
  disabled = false,
  minDate,
  maxDate,
  onChange,
  onOpen,
}: DateFieldProps): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.container}>
      {label ? <RNText style={styles.label}>{label}</RNText> : null}
      <Pressable
        disabled={disabled}
        onPress={() => {
          if (disabled) return;
          onOpen?.();
          setOpen(true);
        }}
        style={[
          styles.field,
          { borderRadius: resolveRadius("md") },
          error && styles.fieldError,
          disabled && styles.fieldDisabled,
        ]}
      >
        <RNText style={[styles.fieldValue, !value && styles.fieldPlaceholder]}>
          {value ? formatDisplay(value) : placeholder ?? "Select date"}
        </RNText>
        <RNText style={styles.fieldIcon}>▾</RNText>
      </Pressable>
      {helperText ? (
        <RNText style={[styles.helper, error && styles.helperError]}>
          {helperText}
        </RNText>
      ) : null}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.popover} onPress={() => undefined}>
            <Calendar
              value={value}
              minDate={minDate}
              maxDate={maxDate}
              onSelect={(iso) => {
                onChange(iso);
                setOpen(false);
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

DateField.displayName = "DateField";

const styles = StyleSheet.create({
  container: { width: "100%" },
  label: { fontSize: 13, color: "#57534E", marginBottom: 6 },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#D6D3D1",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  fieldError: { borderColor: "#DC2626" },
  fieldDisabled: { backgroundColor: "#F5F5F4", borderColor: "#E7E5E4" },
  fieldValue: { fontSize: 14, color: "#1C1917" },
  fieldPlaceholder: { color: "#78716C" },
  fieldIcon: { fontSize: 14, color: "#78716C" },
  helper: { fontSize: 12, color: "#78716C", marginTop: 4 },
  helperError: { color: "#DC2626" },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  popover: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  calHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  calTitle: { fontSize: 16, fontWeight: "600", color: "#1C1917" },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  navText: { fontSize: 24, color: "#1C1917" },
  weekRow: { flexDirection: "row" },
  weekday: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: "#A8A29E",
    paddingVertical: 4,
  },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dayInner: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  dayInnerActive: { backgroundColor: "#7C3AED" },
  dayText: { fontSize: 14, color: "#1C1917" },
  dayTextActive: { color: "#FFFFFF", fontWeight: "600" },
  dayTextDisabled: { color: "#D6D3D1" },
  yearScroll: { maxHeight: 280 },
  yearGrid: { flexDirection: "row", flexWrap: "wrap" },
  yearCell: {
    width: `${100 / 3}%`,
    paddingVertical: 12,
    alignItems: "center",
  },
  yearCellActive: {},
  yearText: { fontSize: 16, color: "#1C1917" },
  yearTextActive: { color: "#7C3AED", fontWeight: "700" },
});
