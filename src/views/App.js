import { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";

import "../styles/App.css";

function App() {
  const [player, setPlayer] = useState({
    money: 0,
    multiplier: 1.0,
    income: 5,
    incomeDelay: 2000,
    clickIncome: 1,
    clickMultiplier: 1.0,
  });

  const ultimateUpgradeFactory = (
    cost = 100,
    costMultiplier = 1.5,
    amount = 1,
    amountMultiplier = 1.5,
    amountBought = 0
  ) => {
    return {
      cost,
      costMultiplier,
      amount,
      amountMultiplier,
      amountBought,
    };
  };

  const upgradeMaker = (_name, _price, _effect, _description) => {
    return {
      name: _name,
      price: _price,
      effect: (p) => {
        setPlayer({
          ...p,
          ..._effect(p),
          money: p.money - _price,
        });
      },
      description: _description,
    };
  };

  const [ultimateUpgrade, setUltimateUpgrade] = useState({
    clickIncome: ultimateUpgradeFactory(100, 1.4, 5, 1.25),
    income: ultimateUpgradeFactory(100, 2, 10, 1.25),
    multiplier: ultimateUpgradeFactory(100, 1.75, 1, 1.25),
  });

  const [upgrades, setUpgrades] = useState([
    upgradeMaker(
      "Upgrade 1",
      0,
      (p) => {
        return {
          multiplier: p.multiplier + 0.1,
        };
      },
      "Increase your multiplier by 10%"
    ),
    upgradeMaker(
      "Upgrade 2",
      1000,
      (p) => {
        return {
          clickMultiplier: p.clickMultiplier * 2,
        };
      },
      "Increase your clickMultiplier by 2x"
    ),
    upgradeMaker(
      "Upgrade 3",
      1000,
      (p) => {
        return {
          multiplier: p.multiplier + 0.2,
        };
      },
      "Increase your multiplier by 20%"
    ),
    upgradeMaker(
      "Upgrade 4",
      10000,
      (p) => {
        return {
          multiplier: p.multiplier * 2,
        };
      },
      "Double multiplier"
    ),
    upgradeMaker(
      "Upgrade 5",
      100000,
      (p) => {
        return {
          incomeDelay: p.incomeDelay / 2,
        };
      },
      "Reduce income delay by half"
    ),
    upgradeMaker(
      "Upgrade 6",
      1000000,
      (p) => {
        return {
          incomeDelay: p.incomeDelay / 2,
        };
      },
      "Reduce income delay by half"
    ),
  ]);

  const purchaseUpgrade = async (e) => {
    const upgrade = upgrades.find((u) => u.name === e.target.value);
    if (player.money >= upgrade.price) {
      upgrade.effect(player);
      setUpgrades(upgrades.filter((u) => u !== upgrade));
    }
  };

  const purchaseUltimateUpgrade = async (e) => {
    if (player.money >= ultimateUpgrade[e.target.value].cost) {
      setPlayer({
        ...player,
        money: player.money - ultimateUpgrade[e.target.value].cost,
        [e.target.value]:
          player[e.target.value] + ultimateUpgrade[e.target.value].amount,
      });
      setUltimateUpgrade({
        ...ultimateUpgrade,
        [e.target.value]: {
          ...ultimateUpgrade[e.target.value],
          cost: Math.floor(
            ultimateUpgrade[e.target.value].cost *
              ultimateUpgrade[e.target.value].costMultiplier
          ),
          amount:
            ultimateUpgrade[e.target.value].amount *
            ultimateUpgrade[e.target.value].amountMultiplier,
        },
      });
    }
  };

  const niceNumber = (val) => {
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  // every player.incomeDelay milliseconds, add player.income to player.money without using setInterval
  // if the player stats are changed, the interval will be restarted
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer({
        ...player,
        money: player.money + player.income * player.multiplier,
      });
    }, player.incomeDelay);
    return () => clearInterval(interval);
  }, [player.money, player.income, player.incomeDelay, player.multiplier]);

  return (
    <Container fluid>
      {/* player information section START */}
      <div className="p-2 m-2 border border-1 rounded">
        <h1>
          Money: <b>{niceNumber(player.money)}</b>
        </h1>
        <h6>
          Multiplier: <b>{player.multiplier.toFixed(2)}</b>
        </h6>
        <h6>
          Income: <b>{niceNumber(player.income)}</b>
        </h6>
        <h6>
          Income Delay: <b>{player.incomeDelay.toFixed(2) / 1000}s</b>
        </h6>
        <h6>
          Click Income: <b>{niceNumber(player.clickIncome)}</b>
        </h6>
        <h6>
          IPS (Income Per Second):{" "}
          <b>
            {niceNumber(
              player.income * player.multiplier * (1000 / player.incomeDelay)
            )}
          </b>
        </h6>
      </div>
      {/* player information section END */}

      {/* upgrades section START */}
      <div className="p-2 m-2 border border-1 rounded">
        <h3>Upgrades</h3>
        {upgrades.map((upgrade) => (
          <div className="p-1 m-1" key={upgrade.name}>
            <div>{upgrade.description}</div>
            <Button
              variant={`${
                player.money < upgrade.price ? "outline-" : ""
              }primary`}
              size="sm"
              disabled={player.money < upgrade.price}
              onClick={purchaseUpgrade}
              value={upgrade.name}
            >
              {upgrade.name} - {niceNumber(upgrade.price)}
            </Button>
          </div>
        ))}
      </div>
      {/* upgrades section END */}

      {/* ultimate upgrades section START */}
      <div className="p-2 m-2 border border-1 rounded">
        <h3>Ultimate Upgrades</h3>
        {["clickIncome", "income", "multiplier"].map((ultyUpgrade) => (
          <div className="p-1 m-1">
            <div>
              Increase your {ultyUpgrade} by{" "}
              <b>{ultimateUpgrade[ultyUpgrade].amount.toFixed(2)}</b>
            </div>
            <Button
              variant={`${
                player.money < ultimateUpgrade[ultyUpgrade].cost
                  ? "outline-"
                  : ""
              }primary`}
              size="sm"
              disabled={player.money < ultimateUpgrade[ultyUpgrade].cost}
              onClick={purchaseUltimateUpgrade}
              value={ultyUpgrade}
            >
              {ultyUpgrade} - {niceNumber(ultimateUpgrade[ultyUpgrade].cost)}
            </Button>
          </div>
        ))}
      </div>
      {/* ultimate upgrades section END */}

      {/* mine section START */}
      <div className="p-2 m-2 border border-1 rounded">
        <Button
          size="sm"
          variant="secondary"
          className="w-100"
          onClick={() =>
            setPlayer({ ...player, money: player.money + player.clickIncome })
          }
        >
          Add {niceNumber(player.clickIncome)}
        </Button>
      </div>
      {/* mine section END */}
    </Container>
  );
}

export default App;
