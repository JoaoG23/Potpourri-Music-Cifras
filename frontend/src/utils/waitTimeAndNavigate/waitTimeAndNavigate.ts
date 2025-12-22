
export const waitTimeAndNavigate = (useNavigate: (path: string) => void, path: string, time: number = 2000) => {
  setTimeout(() => {
    useNavigate(path);
  }, time);
}
