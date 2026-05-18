import { useState, useEffect } from "react";
import { Keyboard } from "react-native";

interface KeyboardStatus {
  visible: boolean;
  height: number;
}

/**
 * Tracks keyboard visibility and height.
 * Ported 1:1 from legacy — used by form snippets and
 * sticky-footer page layouts to adjust bottom padding.
 */
export function useKeyboardStatus(): KeyboardStatus {
  const [status, setStatus] = useState<KeyboardStatus>({
    visible: false,
    height: 0,
  });

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setStatus({ visible: true, height: e.endCoordinates.height });
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setStatus({ visible: false, height: 0 });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return status;
}
