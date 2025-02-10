export const isInputFocused = () => {
  const activeElement = document.activeElement;
  return activeElement instanceof HTMLInputElement || 
         activeElement instanceof HTMLTextAreaElement ||
         (activeElement as HTMLElement)?.isContentEditable;
}; 