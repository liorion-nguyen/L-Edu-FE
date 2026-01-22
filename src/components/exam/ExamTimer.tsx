import { useEffect, useMemo, useRef, useState } from "react";
import { Progress } from "antd";
import "./ExamTimer.css";

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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setRemaining(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (!running || durationSeconds <= 0) {
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
  }, [running, onExpire, durationSeconds]);

  const percent = useMemo(() => {
    if (durationSeconds <= 0) {
      return 0;
    }
    return (remaining / durationSeconds) * 100;
  }, [remaining, durationSeconds]);

  const isUrgent = percent < 20;
  const isWarning = percent < 40 && percent >= 20;

  return (
    <div className="exam-timer-container">
      <div className={`timer-circle-wrapper ${isUrgent ? 'urgent' : isWarning ? 'warning' : ''}`}>
        <Progress
          type="circle"
          percent={Number(percent.toFixed(1))}
          size={100}
          strokeWidth={8}
          strokeColor={isUrgent ? "#ff4d4f" : isWarning ? "#faad14" : "#52c41a"}
          format={() => (
            <div className="timer-display">
              <div className="timer-time">{formatTime(remaining)}</div>
            </div>
          )}
          className="exam-timer-progress"
        />
      </div>
      <div className="timer-info">
        <div className="timer-label">Thời gian còn lại</div>
        <div className="timer-status">
          {isUrgent ? "⚠️ Sắp hết giờ!" : isWarning ? "⏰ Còn ít thời gian" : "✅ Đang làm bài"}
        </div>
      </div>
    </div>
  );
};

export default ExamTimer;

