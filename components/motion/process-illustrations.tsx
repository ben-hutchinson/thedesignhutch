const sketches = [
  [
    "M30 32h112v72H30zM42 46h55M42 60h82M42 74h68",
    "M151 44c22 0 38 12 38 27s-16 27-38 27l-17 15 4-20c-15-5-25-13-25-22 0-15 16-27 38-27Z",
  ],
  [
    "M24 104 110 28l86 76M45 86h130M66 67h88M87 49h46",
    "M58 108V78m104 30V78M110 28v80M22 42h176M36 34v16m148-16v16",
  ],
  [
    "M24 26h172v78H24zM24 42h172M38 56h144v34H38z",
    "M48 34h2m8 0h2m8 0h2M150 111h52V62h-52zM160 72h32v25h-32z",
  ],
  [
    "M24 75h38l12-27 18 51 18-38 14 14h72",
    "M48 28h124v76H48zM64 42h40M64 54h72M151 43a12 12 0 1 1-1 0",
  ],
] as const;

export function ProcessIllustration({ index }: { index: number }) {
  return (
    <svg
      viewBox="0 0 220 128"
      aria-hidden
      className="h-full w-full"
      fill="none"
    >
      {sketches[index]?.map((path) => (
        <path
          key={path}
          d={path}
          stroke="currentColor"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
