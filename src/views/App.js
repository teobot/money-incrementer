import { useEffect, useState } from "react";
import { Container, Button, Row, Col, ButtonGroup } from "react-bootstrap";

import "../styles/App.css";

function App() {
  const [player, setPlayer] = useState({
    money: 0,
    multiplier: 1.0,
    income: 5,
    incomeDelay: 2000,
    clickIncome: 1,
    clickMultiplier: 1.0,
    buildingIncomeMultiplier: 1.0,
  });

  const [multiBuyingOptions, setMultiBuyingOptions] = useState([
    1, 2, 5, 10, 20, 50, 100,
  ]);
  const [buyOptionValue, setBuyOptionValue] = useState(multiBuyingOptions[0]);

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

  const incomeBuildingMaker = (
    name,
    cost,
    amount,
    income,
    multiplier,
    multiplierCost,
    multiplierMultiplier
  ) => {
    return {
      name: name,
      amount: amount,
      cost: cost,
      income: income,
      multiplier: multiplier,
      multiplierCost: multiplierCost,
      multiplierMultiplier: multiplierMultiplier,
    };
  };

  const [ultimateUpgrade, setUltimateUpgrade] = useState({
    clickIncome: ultimateUpgradeFactory(100, 1.4, 5, 1.25),
    income: ultimateUpgradeFactory(100, 2, 10, 1.25),
    multiplier: ultimateUpgradeFactory(100, 1.75, 1, 1.25),
    buildingIncomeMultiplier: ultimateUpgradeFactory(10000, 5, 1, 1.15),
  });

  const [upgrades, setUpgrades] = useState([
    upgradeMaker(
      "Upgrade 1",
      1000,
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
    upgradeMaker(
      "Game Ender",
      1000000000000,
      (p) => {
        return {};
      },
      "Get a trillion dollars and win the game"
    ),
    upgradeMaker(
      "World Destroyer",
      Number.MAX_SAFE_INTEGER,
      (p) => {
        return {};
      },
      "Max safe value for a integer"
    ),
    upgradeMaker(
      "Solar System Easter",
      Number.MAX_VALUE,
      (p) => {
        return {};
      },
      "Max value for a integer"
    ),
  ]);

  const [playerIncomeBuildings, setPlayerIncomeBuildings] = useState([
    incomeBuildingMaker(
      "Mine", // name
      100, // cost
      0, // amount
      5, // income
      1, // multiplier
      1000, // multiplierCost
      1.1 // multiplierMultiplier
    ),
    incomeBuildingMaker(
      "Factory", // name
      1000, // cost
      0, // amount
      10, // income
      1, // multiplier
      10000, // multiplierCost
      1.15 // multiplierMultiplier
    ),
    incomeBuildingMaker(
      "Bank", // name
      10000, // cost
      0, // amount
      100, // income
      1, // multiplier
      100000, // multiplierCost
      1.2 // multiplierMultiplier
    ),
    incomeBuildingMaker(
      "Diamond Mine", // name
      100000, // cost
      0, // amount
      1000, // income
      1, // multiplier
      1000000, // multiplierCost
      1.25 // multiplierMultiplier
    ),
    incomeBuildingMaker(
      "Nuclear Reactors", // name
      10000000, // cost
      0, // amount
      100000, // income
      1, // multiplier
      100000000, // multiplierCost
      1.3 // multiplierMultiplier
    ),
  ]);

  const calculateIncomeBuildingUpgradeCost = (p) => {
    let price = 0;
    let _tempObject = { ...p };
    for (let i = 0; i < buyOptionValue; i++) {
      price += _tempObject.multiplierCost;
      _tempObject.multiplier =
        _tempObject.multiplier * _tempObject.multiplierMultiplier;
      _tempObject.multiplierCost =
        _tempObject.multiplierCost * _tempObject.multiplierMultiplier;
    }
    return {
      price,
      pb: _tempObject,
    };
  };

  const purchaseIncomeBuildingUpgrade = (playerIncomeBuilding) => {
    // upgrade the building multiplier if it is affordable
    const { price, pb } =
      calculateIncomeBuildingUpgradeCost(playerIncomeBuilding);
    if (player.money >= price) {
      setPlayer({
        ...player,
        money: player.money - price,
      });
      setPlayerIncomeBuildings(
        playerIncomeBuildings.map((b) => {
          if (b.name === playerIncomeBuilding.name) {
            return {
              ...b,
              multiplier: pb.multiplier,
              multiplierCost: pb.multiplierCost,
            };
          }
          return b;
        })
      );
    }
  };

  const purchaseIncomeBuilding = (playerIncomeBuilding) => {
    let newPlayerIncomeBuildings = [...playerIncomeBuildings];

    if (player.money >= playerIncomeBuilding.cost * buyOptionValue) {
      newPlayerIncomeBuildings.forEach((building) => {
        if (building.name === playerIncomeBuilding.name) {
          building.amount += buyOptionValue;
        }
      });

      setPlayer({
        ...player,
        money: player.money - playerIncomeBuilding.cost * buyOptionValue,
      });

      setPlayerIncomeBuildings(newPlayerIncomeBuildings);
    }
  };

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

  const calculatePlayerIncome = () => {
    let playerIncome = player.income * player.multiplier;
    let buildingIncome = playerIncomeBuildings.reduce((acc, b) => {
      return acc + b.income * b.amount * b.multiplier;
    }, 0);

    buildingIncome *= player.buildingIncomeMultiplier;
    return playerIncome + buildingIncome;
  };

  const incomePerSecond = () => {
    return calculatePlayerIncome() * (1000 / player.incomeDelay);
  };

  // every player.incomeDelay milliseconds, add player.income to player.money without using setInterval
  // if the player stats are changed, the interval will be restarted
  useEffect(() => {
    const playerIncomeInterval = setInterval(() => {
      setPlayer({
        ...player,
        money: player.money + calculatePlayerIncome(),
      });
    }, player.incomeDelay);
    return () => clearInterval(playerIncomeInterval);
  }, [player.money, player.income, player.incomeDelay, player.multiplier]);

  return (
    <Container
      fluid
      className="bg-dark position-relative d-flex flex-column h-100"
    >
      <Row>
        {/* player information section START */}
        <Col md={12}>
          <div className="border border-1 rounded text-white border-white m-2 p-2">
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
              IPS (Income Per Second): <b>{niceNumber(incomePerSecond())}</b>
            </h6>
          </div>
        </Col>
        {/* player information section END */}

        {/* ultimate upgrades section START */}
        <Col md={4}>
          <div className="border border-1 rounded text-white border-white m-2 p-2">
            <h3>Ultimate Upgrades</h3>
            {Object.keys(ultimateUpgrade).map((ultyUpgrade) => (
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
                  {ultyUpgrade} -{" "}
                  {niceNumber(ultimateUpgrade[ultyUpgrade].cost)}
                </Button>
              </div>
            ))}
          </div>
        </Col>
        {/* ultimate upgrades section END */}

        {/* upgrades section START */}
        <Col md={4}>
          <div className="border border-1 rounded text-white border-white m-2 p-2">
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
        </Col>
        {/* upgrades section END */}

        {/* playerIncomeBuildings section START */}
        <Col md={4}>
          <ButtonGroup aria-label="First group">
            {multiBuyingOptions.map((multiBuyingOption) => (
              <Button
                onClick={() => setBuyOptionValue(multiBuyingOption)}
                active={buyOptionValue !== multiBuyingOption}
                variant="secondary"
              >
                {multiBuyingOption}
              </Button>
            ))}
          </ButtonGroup>
          <div className="border border-1 rounded text-white border-white m-2 p-2">
            <h3>playerIncomeBuildings</h3>
            {playerIncomeBuildings.map((playerIncomeBuilding) => {
              const { price, pb } =
                calculateIncomeBuildingUpgradeCost(playerIncomeBuilding);
              return (
                <div className="p-1 m-1" key={playerIncomeBuilding.name}>
                  <div>
                    you have <b>{playerIncomeBuilding.amount}</b>{" "}
                    {playerIncomeBuilding.name}s, being multiplied by{" "}
                    <b>{playerIncomeBuilding.multiplier.toFixed(2)}</b>
                  </div>
                  <Button
                    className="me-1"
                    disabled={
                      player.money < playerIncomeBuilding.cost * buyOptionValue
                    }
                    variant={`${
                      player.money < playerIncomeBuilding.cost * buyOptionValue
                        ? "outline-"
                        : ""
                    }primary`}
                    size="sm"
                    onClick={() => {
                      purchaseIncomeBuilding(playerIncomeBuilding);
                    }}
                  >
                    Buy {playerIncomeBuilding.name} -{" "}
                    {niceNumber(playerIncomeBuilding.cost * buyOptionValue)}
                  </Button>
                  <Button
                    className="me-1"
                    onClick={() =>
                      purchaseIncomeBuildingUpgrade(playerIncomeBuilding)
                    }
                    disabled={player.money <= price}
                    variant={`${
                      player.money <= price ? "outline-" : ""
                    }success`}
                    size="sm"
                  >
                    Upgrade Multiplier - {niceNumber(price)}
                  </Button>
                </div>
              );
            })}
          </div>
        </Col>
        {/* playerIncomeBuildings section END */}

        {/* mine section START */}
        <Col md={12}>
          <div className="border border-1 rounded text-white border-white m-2 p-5">
            <Button
              size="lg"
              variant="primary"
              className="w-100 h-100"
              onClick={() =>
                setPlayer({
                  ...player,
                  money: player.money + player.clickIncome,
                })
              }
            >
              Add {niceNumber(player.clickIncome)}
            </Button>
          </div>
        </Col>
        {/* mine section END */}
      </Row>
    </Container>
  );
}

export default App;
