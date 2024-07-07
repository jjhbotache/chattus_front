import { PanInfo, motion } from "framer-motion";
import { colors } from "../../globalStyle";
import { useState } from "react";

interface Props {
  recordAndSendAud: () => void;
  stopRecording: () => void;
  onSetCancel: (cancel:boolean) => void;
}

export default function MicroRecorder({ recordAndSendAud, stopRecording, onSetCancel }: Props) {
  const [style, setStyle] = useState<any>({
    scale: 1.5,
    backgroundColor: colors.secondary,
    borderRadius: "50%",
  });

  const onDragging = (_:MouseEvent | PointerEvent | TouchEvent, info:PanInfo) => {
    onSetCancel(true);
    if (info.offset.x < 0) {
      setStyle({
        scale: 5,
        backgroundColor: colors.secondary,
        borderRadius: "50%",
      })
    } 
    if (info.offset.x <= -100) {
      onSetCancel(false);
      setStyle({
        scale: 3,
        backgroundColor: "red",
        borderRadius: "50%",
      });
    }
  }
    



  return (
    <motion.div
      onTapStart={recordAndSendAud}
      onPointerUp={stopRecording}
      whileTap={{
        scale: 5,
        backgroundColor: colors.secondary,
        borderRadius: "50%",
      }}
      drag="x"
      dragConstraints={{ left: -200, right: 0 }}
      dragElastic={0.1}
      dragSnapToOrigin={true}
      whileDrag={style}
      onDrag={onDragging} 
    >
      <i className={`fi fi-rr-microphone voiceIcon `}></i>
    </motion.div>
  );
}
