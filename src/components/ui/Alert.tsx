import {
  Info,
  CircleX,
  CircleAlert,
  CircleCheck,
} from "lucide-react";

export type AlertType = "info" | "error" | "warning" | "success";

export type AlertData = {
  type: AlertType;
  title: string;
  msg: string;
};

interface AlertProps {
  type: AlertType;
  title: string;
  children: React.ReactNode;
}

const styles = {
  info: {
    bg: "bg-[#35558f]",
    border: "border-[#5685ff]",
    icon: Info,
    iconColor: "text-[#a9bde5]",
    titleColor: "text-[#a9bde5]",
  },

  error: {
    bg: "bg-[#82241d]",
    border: "border-[#bd3d30]",
    icon: CircleX,
    iconColor: "text-[#e0a5a0]",
    titleColor: "text-[#e0a5a0]",
  },

  warning: {
    bg: "bg-[#765c20]",
    border: "border-[#c99b32]",
    icon: CircleAlert,
    iconColor: "text-[#e8d19a]",
    titleColor: "text-[#e8d19a]",
  },

  success: {
    bg: "bg-[#28633f]",
    border: "border-[#42a86b]",
    icon: CircleCheck,
    iconColor: "text-[#a4d8b8]",
    titleColor: "text-[#a4d8b8]",
  },
};

export default function Alert({
  type,
  title,
  children,
}: AlertProps) {
  const style = styles[type];
  const Icon = style.icon;

  return (
    <div
      className={`
        w-[375px]
        max-w-[calc(100vw-32px)]
        rounded-[18px]
        border-2
        px-[18px]
        py-[15px]
        ${style.bg}
        ${style.border}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Icon
          size={14}
          strokeWidth={3}
          className={style.iconColor}
        />

        <span
          className={`
            text-[14px]
            tracking-[2px]
            ${style.titleColor}
          `}
        >
          {title}
        </span>
      </div>

      {/* Message */}
      <div
        className="
          mt-3
          text-[15px]
          leading-[1.4]
          tracking-[0.5px]
          text-white
        "
      >
        {children}
      </div>
    </div>
  );
}