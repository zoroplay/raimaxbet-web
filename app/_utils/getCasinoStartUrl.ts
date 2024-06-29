import store from "@/_redux/store";

const playGame = async (payload: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PROD_API}/c27/start-session`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${store.getState().user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  return await response.json();
};

const startC27Game = async (payload: any) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_PROD_API}/c27/start-session`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${store.getState().user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  // console.log(await response.json(), "resc27");
  return await response.json();
};

const startEvoPlayGame = async (payload: any) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_PROD_API}/evo-play/get-game-url`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${store.getState().user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return await response.json();
};

const startShackEvoGame = async (payload: any) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_PROD_API}/shacks-evo/start/${payload}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${store.getState().user.token}`,
        "Content-Type": "application/json",
      },
      // body: JSON.stringify(payload),
    }
  );
  // console.log(response);
  return await response.json();
};

const startTadaGame = async (payload: any) => {
  const response: any = await fetch(
    `${process.env.NEXT_PUBLIC_PROD_API}/tada/get-game-url`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${store.getState().user.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  return await response.json();
};

// const startSpinmatic = async (payload: any) => {
//   const response: any = await fetch(
//     `${process.env.NEXT_PUBLIC_PROD_API}/c27/start-session`,
//     {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${store.getState().user.token}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     }
//   );

//   return await response.json();
// };

const startShackEvo = async (gameId: any) => {
  const response = await startShackEvoGame(gameId);
  return response?.session_url;
};

const startEvoPlay = async (payload: any) => {
  const response = await startEvoPlayGame(payload);

  return response?.data?.link;
};

const startC27 = async (payload: any) => {
  const response = await startC27Game(payload);

  return response?.result?.SessionUrl;
};

const startTada = async (payload: any) => {
  const response = await startTadaGame(payload);

  return response?.Data;
};
const startSpinmatic = async (payload: any) => {
  const response = await playGame(payload);
  return response;
  // return `${process.env.REACT_APP_XPRESS_LAUNCH_URL}?token=${token}&game=${id}&backurl=${backurl}&mode=${mode}&group=${group}&clientPlatform=mobile&h=${hash}`;
};

const getCasinoStartUrl = async (provider: string, payload: any) => {
  console.log(provider, payload, "papv");
  switch (provider) {
    case "c27":
      payload = { ...payload, demo: 0 };
      const response = await startC27(payload);
      return response;

    case "shack-evolution":
      const res = await startShackEvo(payload?.game_id);
      return res;
    case "tada-games":
      payload = { ...payload, demo: 0 };
      return await startTada({ game_id: payload?.game_id });

    case "golden-race":
      payload = { ...payload, demo: 0 };
      return await startSpinmatic({ provider, payload });

    case "evo-play":
      payload = {
        ...payload,
        home_url: "https://web.raimax.bet/",
        deposit_url: "https://web.raimax.bet/deposit",
      };
      return await startEvoPlay(payload);
    default:
  }
};

export default getCasinoStartUrl;
