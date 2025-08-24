const scrollToElemendId = (
  event: React.MouseEvent<HTMLAnchorElement>,
  id: string,
  offset: number = 0
) => {
  event.preventDefault();

  const element = document.getElementById(id);
  if (!element) return;

  const bodyRect = document.body.getBoundingClientRect().top;
  const elementRect = element.getBoundingClientRect().top;
  const elementPosition = elementRect - bodyRect;
  const offsetPosition = elementPosition - offset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

export default scrollToElemendId;