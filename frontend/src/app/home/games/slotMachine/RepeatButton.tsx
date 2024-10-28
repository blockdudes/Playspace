const RepeatButton = ({ onClick }: { onClick: () => void }) => {
    return (
      <button
        aria-label="Play again."
        id="repeatButton"
        onClick={onClick}
        className="absolute top-2.5 right-5 w-12 h-12 bg-[url('https://andyhoffman.codes/random-assets/img/slots/repeat.png')] bg-cover cursor-pointer animate-spin"
      />
    );
  };
  
  export default RepeatButton;
  