import IdleTimer from "../Helper/Sessionlogout";

export const Sessionout = () => {
  const timer = new IdleTimer({
    timeout: 1800, //expire after some seconds
    onTimeout: () => {
      window.location.href = "/loginhome"
    },
    onExpired: () => {
      window.location.reload(true);
    }
  });

  return () => {
    timer.cleanUp()
  };
}


