export const isLastSession = () => {
  const sessions = localStorage.getItem("sessions");
  return sessions && parseInt(sessions) === 1;
}

export const wasPageReloaded = () => {
  return window.performance
    .getEntriesByType('navigation')
    .map((nav) => (nav as PerformanceNavigationTiming).type)
    .includes('reload');
}

export const isChatAboutToBeTerminated = () => {
  const terminationTime = sessionStorage.getItem('terminationTime');

  if(!terminationTime)
    return false;

  return 4000 > (Date.now() - parseInt(terminationTime));
}
