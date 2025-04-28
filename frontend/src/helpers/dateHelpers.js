export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getDuration = (from) => {
  const now = new Date();
  const start = new Date(from);
  let diff = Math.floor((now - start) / 1000);

  const years = Math.floor(diff / (3600 * 24 * 365));
  diff -= years * 3600 * 24 * 365;
  const months = Math.floor(diff / (3600 * 24 * 30));
  diff -= months * 3600 * 24 * 30;
  const days = Math.floor(diff / (3600 * 24));
  diff -= days * 3600 * 24;
  const hours = Math.floor(diff / 3600);
  diff -= hours * 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff - minutes * 60;

  return `${years > 0 ? years + "г " : ""}${months > 0 ? months + "мес " : ""}${
    days > 0 ? days + "д " : ""
  }${hours}ч ${minutes}м ${seconds}с`;
};
