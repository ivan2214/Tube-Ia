export const formatTime = (seconds: number): string => {
  if (Number.isNaN(seconds)) return "00:00:00";

  // obtener las horas, minutos y segundos
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // formatear las horas, minutos y segundos
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

  // concatenar las partes formateadas
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
