type IconProps = React.SVGProps<SVGSVGElement> & { size?: number };

function baseProps({ size = 16, ...rest }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...rest,
  };
}

export function PlaneIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M10.5 13.5 3 11l1.5-2 8 1.5L18 4.5a2 2 0 1 1 2 2L14 12l1.5 8-2 1.5-2.5-7.5-3 3v3l-1.5 1-1.5-3-3-1.5 1-1.5h3l3-3Z" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...baseProps(props)}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
