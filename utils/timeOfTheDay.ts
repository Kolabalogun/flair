const getTimeOfDay = (): string => {
  const currentTime: number = new Date().getHours();
  let greeting: string;

  if (currentTime >= 5 && currentTime < 12) {
    greeting = "Good Morning";
  } else if (currentTime >= 12 && currentTime < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return greeting;
};

export default getTimeOfDay;
