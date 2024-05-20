
<h3 align="center">WaclanBot</h3>

  <p align="center">
    <a href="[https://github.com/brblacky/lavamusic](https://github.com/h00z3x/Lost-Music-V2)">Lost-Music-V2</a>의 수정된 버전
    <br/>
  </p>
</p>

## Table Of Contents

* [About the Project](#about-the-project)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Authors](#authors)
* [Acknowledgements](#acknowledgements)

## About The Project

WaclanBot은 LavaMusic과 Lost-Music-V2의 수정된 버전으로
한글 제공 및 몇가지 커스터마이징을 했습니다.

## Getting Started

node.js를 최신 버전으로 유지해 주세요.

### Prerequisites

* npm

```sh
npm install npm@latest -g
```

### Installation

1. 레포 클론

```sh
git clone https://github.com/KimPig/WaclanBot.git
```

2. NPM 패키지 설치

```sh
npm install
```

3. .env 파일 수정

```dotenv
TOKEN="" # 봇 토큰
PREFIX="-" # 봇 접두사
OWNER_IDS="id, id, id" # 주인 ID
CLIENT_ID="clientid" # 봇 클라이언트 ID
GUILD_ID="" # 서버 ID (오직 한 서버에서 사용할 경우에만 추가하세요)
PRODUCTION="true" 
DATABASE_URL="file:./database.db" 
LAVALINK_URL="" # lavalink 주소
LAVALINK_AUTH="1" # lavalink 비밀번호
LAVALINK_NAME="" # lavalink 이름
LAVALINK_SECURE= "" # lavalink 암호화
BOT_ACTIVITY_TYPE="Watching" # "Listening","Watching","Competing","Custom","Playing","Streaming" 에서 선택하세요
BOT_STATUS="online"
BOT_ACTIVITY="WaclanBot"
GENIUS_KEY=""
```

4. Prisma 생성
```sh
npx prisma generate
```
5. 데이터베이스 생성
```sh
npx prisma migrate dev
```

## Usage

실행:
```sh
node index.js
```

## Roadmap

도커 이미지 화 예정.

## Authors

* **KimPig** - *This Repo Writer* - [KimPig](https://github.com/kimpig) - *Some Changes and Fixes*
* **h00z3x** - *Developer* - [h00z3x](https://github.com/h00z3x/) - *almost everthing in js, Lyrics, Database, Fix Playlist*
* **brblacky** - *The Person I respect* - [brblacky](https://github.com/brblacky/) - *almost everything in typescript*

## Acknowledgements

* [Lost-Music-V2](https://github.com/h00z3x/Lost-Music-V2)
* [LavaMusic](https://github.com/brblacky/lavamusic)
