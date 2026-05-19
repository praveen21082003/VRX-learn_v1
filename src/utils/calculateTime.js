 export const calculateTime = (time) => {
  if (isNaN(time)) return "0:00";

  const hours = Math.floor(time / 3600);
  const mins = Math.floor((time % 3600) / 60);
  const secs = Math.floor(time % 60);

  // If duration is 1 hour or more
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  // Below 1 hour -> MM:SS
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

