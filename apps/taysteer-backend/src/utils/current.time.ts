export const getTime = (): string => {
  const date_ob = new Date();

  // Adjust 0 before single digit date
  const date = ("0" + date_ob.getDate()).slice(-2);

  // Current month
  const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

  // Current year
  const year = date_ob.getFullYear();

  // Current hours
  const hours = date_ob.getHours();

  // Current minutes
  const minutes = date_ob.getMinutes();

  // Current seconds
  const seconds = date_ob.getSeconds();

  // Date & time in YYYY-MM-DD HH:MM:SS format
  const dateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

  return dateTime;
};