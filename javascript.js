/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next / prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
  currentIndex: 0,
  songs: [
    {
      name: 'Anh Đã Ổn Hơn',
      singer: 'MCK',
      path: './asset/music/AnhDaonHon.mp3',
      image: './asset/img/img1.avif'
    },
    {
      name: 'Chỉ Còn Những Mùa Nhớ',
      singer: 'Hà Anh Tuấn',
      path: './asset/music/CCNMN.mp3',
      image: './asset/img/img2.avif'
    },
    {
      name: 'Đôi Lời',
      singer: 'Hoàng Dũng',
      path: './asset/music/DoiLoi.mp3',
      image: './asset/img/song3.jpg'
    },
    {
      name: 'Mùa Hè Ở Lại',
      singer: 'Vy Vy',
      path: './asset/music/MuaHeOLai-VyVy.mp3',
      image: './asset/img/song4.jpg'
    },
    {
      name: 'Người Ta Nói',
      singer: 'Minh Mon',
      path: './asset/music/NguoiTaNoi.mp3',
      image: './asset/img/img3.avif'
    },
    {
      name: 'Trái Đất Tròn Không Gì Là Không Thể',
      singer: 'Trung Quân Idol',
      path: './asset/music/TraiDatTronKhongGiLaKhongThe.mp3',
      image: './asset/img/img4.avif'
    },
    {
      name: 'Vài Câu Nói',
      singer: 'GreyD',
      path: './asset/music/VaiCauNoi.mp3',
      image: './asset/img/img5.avif'
    },
    {
      name: 'Trời Giấu Trời Mang Đi',
      singer: 'Amee',
      path: './asset/music/TroiGiauTroiMangDi.mp3',
      image: './asset/img/img6.avif'
    },
    {
      name: 'Lời Tạm Biệt Chưa Nói',
      singer: 'GreyD',
      path: './asset/music/LoiTamBietChuaNoi.mp3',
      image: './asset/img/song9.jpg'
    },
    {
      name: 'Khi Cô Đơn Em Nhớ Ai',
      singer: 'Hoàng Dũng',
      path: './asset/music/KhiCoDonEmNhoAi.mp3',
      image: './asset/img/img1.avif'
    },
    {
      name: 'Có Hẹn Với Thanh Xuân',
      singer: 'GreyD',
      path: './asset/music/CoHenVoiThanhXuan.mp3',
      image: './asset/img/img5.avif'
    },
    
  ],
  render: function() {
    const htmls = this.songs.map((song, index) => {
      return `
        <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
          <div class="thumb" style="background-image: url('${song.image}')"></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>
      `
    })
    playlist.innerHTML = htmls.join('')
  },
  defineProperties: function() {
    Object.defineProperty(this, 'currentSong', {
      get: function() {
        return this.songs[this.currentIndex]
      }
    })
  },
  handleEvents: function() {
    // CD rotate
    const cdThumbAnimate = cdThumb.animate([
      { transform: 'rotate(360deg)'}
    ], {
      duration: 10000,
      iterations: Infinity
    })
    cdThumbAnimate.pause()

    //Zoom in / out CD
    const cdWidth = cd.offsetWidth
    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const newCdWidth = cdWidth - scrollTop
      cd.style.width = newCdWidth > 0 ? newCdWidth : 0
      cd.style.opacity = newCdWidth / cdWidth
    }
    
    //Click Turn On / Turn Off Music
    playBtn.onclick = function() {
      if (player.classList.contains('playing')) {
        player.classList.remove('playing')
        audio.pause()
        cdThumbAnimate.pause()
      } else {
        player.classList.add('playing')
        audio.play()
        cdThumbAnimate.play()
      }
      // Range
      audio.ontimeupdate = function() {
        if (audio.duration) {
          const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
          progress.value = progressPercent
        }
      }  
      // Tua
      progress.oninput = function(e) {
        const seekTime = e.target.value * audio.duration / 100
        audio.currentTime = seekTime
      }
    }

    // Click Next or Previous
    nextBtn.onclick = function() {
      if (randomBtn.classList.contains('active')) {
        app.playRandomSong()
      } else {
        app.nextSong()
        cdThumbAnimate.play()
        player.classList.add('playing')
      }
      audio.play()
      app.scrollToActiveSong()
      app.render()
    }

    prevBtn.onclick = function() {
      if (randomBtn.classList.contains('active')) {
        app.playRandomSong()
      } else {
        app.prevSong()
        player.classList.add('playing')
      }
      audio.play()
      app.scrollToActiveSong()
      app.render()
    }

    // Shuffle
    randomBtn.onclick = function() {
      if (randomBtn.classList.contains('active')) {
        randomBtn.classList.remove('active')
      } else {
        randomBtn.classList.add('active')
      }
    }

    // Repeat
    repeatBtn.onclick = function() {
      if (repeatBtn.classList.contains('active')) {
        repeatBtn.classList.remove('active')
      } else {
        repeatBtn.classList.add('active')
      }
    }
    // When ended
    audio.onended = function() {
      if (repeatBtn.classList.contains('active')) {
        audio.play()
      } else {
        nextBtn.click()
      }
    }

    //Play when click playlist
    playlist.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)')

      // When click Option
      if(e.target.closest('.option')) {
        return alert("Một ngày tốt lành và Trân trọng những khoảng khắc hiện tại bạn nhé!")
      }

      // When click the Song
      if(songNode) {
        app.currentIndex = Number(songNode.dataset.index)
        player.classList.add('playing')
        app.loadCurrentSong()
        app.render()
        audio.play()
        cdThumbAnimate.play()
      } 
    }
  },
  scrollToActiveSong: function() {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: "end",
      })
    }, 100);
  },
  loadCurrentSong: function() {
    heading.textContent = this.currentSong.name
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
    audio.src = this.currentSong.path
  },
  nextSong: function() {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  prevSong: function() {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },
  playRandomSong: function() {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },
  start: function() {
    this.defineProperties()
    this.handleEvents()
    this.loadCurrentSong()
    this.render()
  }
}
app.start()