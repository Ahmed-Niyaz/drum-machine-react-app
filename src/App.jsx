import { useState } from "react";
import { firstSounds, secondSounds } from "./data";
import { useEffect } from "react";

export default function App() {
  const [sounds, setSounds] = useState(secondSounds);
  const [str, setStr] = useState("");
  const [soundType, setSoundType] = useState("BANK");
  const [volume, setVolume] = useState(1);
  const [power, setPower] = useState(false);

  const handleKeyPress = (id, keyTrigger) => {
    setStr(keyTrigger);
    const audio = document.getElementById(id);
    audio.currentTime = 0;
    audio.play();
  };

  const handleSoundType = () => {
    if (soundType === "BANK") {
      setSoundType("NOT_BANK");
      setStr("Heater Kit");
    } else {
      setSoundType("BANK");
      setStr("Smooth Piano Kit");
    }
  };

  const handleVolume = (e) => {
    setVolume(parseFloat(e.target.value));
    setStr(Math.floor(parseFloat(e.target.value) * 100) + "%");

    const allAudios = sounds.map((sound) => document.getElementById(sound.id));
    allAudios.forEach((audio) => {
      if (audio) {
        audio.volume = volume;
      }
    });
  };

  const togglePower = () => {
    setPower(!power);
    setStr('');
  };

  useEffect(() => {
    if (soundType === "BANK") {
      setSounds(secondSounds);
    } else {
      setSounds(firstSounds);
    }
  }, [soundType]);

  useEffect(() => {
    function handleKeyPress(e) {
      if (power) return;
      const sound = sounds.find((sound) => sound.keyCode === e.keyCode);

      if (sound) {
        const audio = document.getElementById(sound.id);
        audio.currentTime = 0;
        audio.play();
        setStr(sound.keyTrigger);
      }
    }

    document.addEventListener("keydown", handleKeyPress);

    return () => document.removeEventListener("keydown", handleKeyPress);
  });

  return (
    <>
    <div className="flex justify-center items-center">
    <h1 className="text-center mb-12 text-4xl border-b-2 border-yellow-300 pb-1">Drum Machine</h1>
    </div>
    <div
      className="inner-container flex md:flex-row flex-col justify-center items-center border-8 border-solid border-yellow-200 md:p-16 md:gap-[6rem] p-8 gap-[3rem] bg-[#b3b3b3] rounded-xl"
      id="drum-machine"
    >
      <div className="pad-bank grid grid-cols-3 gap-3">
        {sounds.map((sound, index) => {
          const { id, keyTrigger } = sound;
          return (
            <Keys
              key={id}
              {...sound}
              handleKeyPress={handleKeyPress}
              power={power}
            />
          );
        })}
      </div>

      <div className="controls-container flex flex-col justify-center items-center gap-5 text-black">
        <div className="control flex flex-col items-center justify-center gap-1">
          <p>Power</p>
          <input
            type="checkbox"
            className="toggle toggle-success"
            defaultChecked
            onClick={togglePower}
          />
        </div>
        <div
          id="display"
          className="p-3 w-[200px] h-[50px] bg-gray-500 text-center flex justify-center items-center rounded"
        >
          {str}
        </div>
        <div className="volume-slider px-2 flex justify-center items-center">
          <input
          disabled={power}
            type="range"
            min="0"
            max="1"
            value={volume}
            className="range range-error bg-black"
            step="0.01"
            onChange={handleVolume}
          />
        </div>
        <div className="control flex flex-col items-center justify-center gap-1">
          <p>Bank</p>
          <input
          disabled={power}
            type="checkbox"
            className="toggle toggle-info"
            defaultChecked
            onClick={handleSoundType}
          />
        </div>
      </div>
    </div>
    </>
  );
}

function Keys({ id, keyCode, keyTrigger, url, power, handleKeyPress }) {
  return (
    <button
      disabled={power}
      onClick={() => handleKeyPress(id, keyTrigger)}
      className="drum-pad border-2 border-solid border-black text-center md:px-10 md:py-6 px-7 py-4 cursor-pointer rounded-md  md:text-3xl text-2xl bg-[grey] text-black hover:bg-yellow-500"
      id={keyTrigger}
    >
      <audio id={id} className="clip" src={url}></audio>
      <p className="hover:translate-y-1">{id}</p>
    </button>
  );
}
