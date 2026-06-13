import { useEffect, useRef, useState } from "react";
import Icon from "./Icon";

/**
 * CountUp — Animated number counter that counts from `from` to `to` over `duration` ms
 *
 * Usage: <CountUp to={25000} format={(v)=>fmt(v)} />
 */
function CountUp({ to = 0, from = 0, duration = 1200, format, easing = "easeOut" }) {
  const [value, setValue] = useState(from);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    startTimeRef.current = null;
    const startValue = value;
    const change = to - startValue;

    const ease = (t) => {
      if (easing === "easeOut") return 1 - Math.pow(1 - t, 3);
      if (easing === "easeInOut") return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      return t;
    };

    const step = (now) => {
      if (!startTimeRef.current) startTimeRef.current = now;
      const elapsed = now - startTimeRef.current;
      const t = Math.min(elapsed / duration, 1);
      setValue(Math.round(startValue + change * ease(t)));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [to, duration, easing]);

  return <>{format ? format(value) : value}</>;
}

export default CountUp;
