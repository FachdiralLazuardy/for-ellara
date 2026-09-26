const envelope =
  document.getElementById("envelope");

const openButton =
  document.getElementById("openButton");

const opening =
  document.getElementById("opening");

const letterSection =
  document.getElementById("letterSection");

const letterContent =
  document.getElementById("letterContent");

const paragraphs =
  Array.from(
    letterContent.querySelectorAll("p")
  );

const signature =
  document.getElementById("signature");

const musicButton =
  document.getElementById("musicButton");

const musicNote =
  document.getElementById("musicNote");

const music =
  document.getElementById("music");

const progressBar =
  document.getElementById("progressBar");

const musicPlayer =
  document.querySelector(".music-player");

const backButton =
  document.getElementById("backButton");


/* ==================================================
   SETTINGS
================================================== */

const typingSpeed = 28;

const paragraphDelay = 350;


/* ==================================================
   SAVE ORIGINAL LETTER
================================================== */

const originalText =
  paragraphs.map((paragraph) =>
    paragraph.textContent
      .replace(/\s+/g, " ")
      .trim()
  );


/* ==================================================
   RESET LETTER
================================================== */

function resetLetter() {

  paragraphs.forEach(
    (paragraph, index) => {

      paragraph.textContent = "";

      paragraph.classList.remove(
        "visible",
        "typing-cursor"
      );

      paragraph.dataset.text =
        originalText[index];
    }
  );


  signature.classList.remove(
    "visible"
  );


  musicButton.classList.remove(
    "ready"
  );

  musicButton.disabled = true;

  musicButton.textContent = "▶";


  musicPlayer.classList.remove(
    "ready"
  );


  musicNote.textContent =
    "finish the letter first ♡";


  progressBar.style.width =
    "0%";
}


/* ==================================================
   TYPE ONE PARAGRAPH
================================================== */

function typeParagraph(
  paragraph,
  text
) {

  return new Promise(
    (resolve) => {

      paragraph.classList.add(
        "visible"
      );

      paragraph.classList.add(
        "typing-cursor"
      );


      let index = 0;


      const interval =
        setInterval(() => {

          paragraph.textContent =
            text.slice(
              0,
              index + 1
            );

          index++;


          if (
            index >= text.length
          ) {

            clearInterval(
              interval
            );

            paragraph.classList.remove(
              "typing-cursor"
            );

            resolve();
          }

        }, typingSpeed);
    }
  );
}


/* ==================================================
   TYPE WHOLE LETTER
================================================== */

async function typeLetter() {

  for (
    let i = 0;
    i < paragraphs.length;
    i++
  ) {

    const paragraph =
      paragraphs[i];

    const text =
      paragraph.dataset.text;


    await typeParagraph(
      paragraph,
      text
    );


    await new Promise(
      (resolve) => {

        setTimeout(
          resolve,
          paragraphDelay
        );

      }
    );
  }


  /* Signature */

  signature.classList.add(
    "visible"
  );


  await new Promise(
    (resolve) => {

      setTimeout(
        resolve,
        900
      );

    }
  );


  /* Enable music */

  musicButton.disabled = false;

  musicButton.classList.add(
    "ready"
  );

  musicPlayer.classList.add(
    "ready"
  );


  musicNote.textContent =
    "a little something to listen to ♡";
}


/* ==================================================
   OPEN LETTER
================================================== */

openButton.addEventListener(
  "click",
  () => {

    envelope.classList.add(
      "open"
    );

    openButton.disabled = true;


    setTimeout(
      () => {

        opening.style.display =
          "none";


        letterSection.classList.add(
          "visible"
        );


        resetLetter();


        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });


        setTimeout(
          () => {

            typeLetter();

          },
          700
        );

      },
      1100
    );

  }
);


/* ==================================================
   MUSIC PLAYER
================================================== */

musicButton.addEventListener(
  "click",
  async () => {

    if (music.paused) {

      try {

        await music.play();


        musicButton.textContent =
          "Ⅱ";


        musicNote.textContent =
          "playing something for you ♡";

      }

      catch (error) {

        console.error(
          "Music failed to play:",
          error
        );


        musicNote.textContent =
          "add assets/music.mp3 first ♡";
      }

    }

    else {

      music.pause();


      musicButton.textContent =
        "▶";


      musicNote.textContent =
        "paused ♡";
    }

  }
);


/* ==================================================
   MUSIC PROGRESS
================================================== */

music.addEventListener(
  "timeupdate",
  () => {

    if (
      music.duration &&
      !isNaN(music.duration)
    ) {

      const percentage =
        (
          music.currentTime /
          music.duration
        ) * 100;


      progressBar.style.width =
        `${percentage}%`;
    }

  }
);


/* ==================================================
   MUSIC ENDED
================================================== */

music.addEventListener(
  "ended",
  () => {

    musicButton.textContent =
      "▶";


    musicNote.textContent =
      "a little something to listen to ♡";


    progressBar.style.width =
      "0%";
  }
);


/* ==================================================
   RESET MUSIC
================================================== */

function resetMusic() {

  music.pause();

  music.currentTime = 0;

  progressBar.style.width =
    "0%";

  musicButton.textContent =
    "▶";

  musicNote.textContent =
    "finish the letter first ♡";
}


/* ==================================================
   BACK BUTTON
================================================== */

backButton.addEventListener(
  "click",
  () => {

    resetMusic();


    letterSection.classList.remove(
      "visible"
    );


    envelope.classList.remove(
      "open"
    );


    opening.style.display =
      "flex";


    openButton.disabled =
      false;


    resetLetter();


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }
);