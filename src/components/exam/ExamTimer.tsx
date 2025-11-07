import { useEffect, useMemo, useRef, useState } from "react";
import { Progress } from "antd";

interface ExamTimerProps {
  durationSeconds: number;
  onExpire?: () => void;
  running?: boolean;
}

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
};

export const ExamTimer: React.FC<ExamTimerProps> = ({ durationSeconds, onExpire, running = true }) => {
  const [remaining, setRemaining] = useState(durationSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setRemaining(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, onExpire]);

  const percent = useMemo(() => (remaining / durationSeconds) * 100, [remaining, durationSeconds]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Progress
        type="circle"
        percent={Number(percent.toFixed(1))}
        size={64}
        strokeColor={percent < 20 ? "#ff4d4f" : "#5A67D8"}
        format={() => formatTime(remaining)}
      />
      <div>
        <div style={{ fontWeight: 600, fontSize: 16 }}>Thời gian còn lại</div>
        <div style={{ color: "var(--text-secondary)" }}>{formatTime(remaining)}</div>
      </div>
    </div>
  );
};

export default ExamTimer;

