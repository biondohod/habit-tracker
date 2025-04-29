export const openModalLock = (lock = true) => {
  if (typeof window === "undefined") return;
  const body = document.body;
  if (lock) {
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    body.style.paddingRight = scrollBarWidth ? `${scrollBarWidth}px` : "";
  } else {
    body.style.overflow = "";
    body.style.paddingRight = "";
  }
};
