function CloseCircle({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10.016 10.016 0 0 0 12 2m3.36 12.3a.754.754 0 0 1 0 1.06.75.75 0 0 1-1.06 0l-2.3-2.3-2.3 2.3a.75.75 0 0 1-1.06 0 .754.754 0 0 1 0-1.06l2.3-2.3-2.3-2.3A.75.75 0 0 1 9.7 8.64l2.3 2.3 2.3-2.3a.75.75 0 0 1 1.06 1.06l-2.3 2.3z"
      ></path>
    </svg>
  );
}

export { CloseCircle };
