import { useState } from "react";
import { useSmcc } from "../contexts/SmccContext";
import styles from "./Totals.module.css";

import PageWide from "../components/PageWide";
import TabNavigation from "../components/TabNavigation";
import Button from "../components/buttons/Button";
import LinkButton from "../components/buttons/LinkButton";
import { XlsxButton } from "../components/buttons/XlsxButton";

function Totals() {
    const { partsData, assembly, options, baseAssembly, calcKitPrice } =
        useSmcc();
    const [isOpen, setIsOpen] = useState(false);

    function handleOpen() {
        setIsOpen(!isOpen);
    }

    // Calculate total price of assembly object
    let assemblyPrice = 0;

    for (const kitID in assembly) {
        const quantity = assembly[kitID];
        const kitPrice = calcKitPrice(kitID);
        assemblyPrice += kitPrice * quantity;
    }

    // Calculate total price of baseAssembly object
    let baseAssemblyPrice = 0;

    for (const kitID in baseAssembly) {
        const quantity = baseAssembly[kitID];
        const kitPrice = calcKitPrice(kitID);
        baseAssemblyPrice += kitPrice * quantity;
    }

    // Calculate total price of spare and shipped loose kit
    const spareShippedLoosePrice = options.size
        ? calcKitPrice("spareShippedLoose")
        : 0;

    // Calculate total price of all non variable parts
    let nonVariablePartsPrice = calcKitPrice(`${options.size}`) || 0;

    // Calculate total price of all non variables including shipping, labor, spare and shipped loose
    let nonVariablePrice =
        calcKitPrice(`${options.size}`) +
            calcKitPrice(`${options.size}LaborShip`) +
            spareShippedLoosePrice || 0;

    // Calculate total price of SMCC including all variable and non variable options
    const smccPrice = nonVariablePrice + assemblyPrice;

    // Retrieve STC
    const selectedStc = partsData.filter((part) => part.id === options.stc)[0];

    // Retrieve selected size labor "part"
    const selectedSizeLabor = partsData.filter(
        (part) => part.id === `labor-${options.size}`
    )[0];

    // Retrieve install labor "part"
    const installLabor = partsData.filter(
        (part) => part.id === "labor-install"
    )[0];

    // Retrieve freight "part"
    const freight = options.size
        ? partsData.filter((part) => part.id === "freight")[0]
        : 0;

    // Retrieve and sum consumables
    const consumablesMisc = partsData.filter(
        (part) => part.id === "consumables-misc"
    )[0];

    const consumablesSize = partsData.filter(
        (part) => part.id === `consumables-${options.size}`
    )[0];

    const totalConsumables =
        consumablesMisc?.price + consumablesSize?.price || 0;

    return (
        <PageWide>
            <TabNavigation>
                <LinkButton route={"/assemblyForm"}>Edit Inputs</LinkButton>
                <LinkButton route={"/kitSummary"}>Kit Summary</LinkButton>

                <LinkButton route={"/partSummary"}>Part Summary</LinkButton>
                <Button isActive={false}>Totals</Button>

                <XlsxButton />
            </TabNavigation>
            <h2>TOTALS</h2>
            <ul className={styles.totalsUl}>
                <li>
                    <div className={styles.totalsLabel}>
                        {options.stc || "STC"}
                    </div>
                    <div>
                        {selectedStc?.price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        }) ||
                            (0).toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            })}
                    </div>
                </li>

                <li onClick={handleOpen} className={styles.clickable}>
                    <div className={styles.totalsLabel}>
                        SMCC{" "}
                        {isOpen ? (
                            <span className={styles.materialSymbolsOutlined}>
                                keyboard_arrow_up
                            </span>
                        ) : (
                            <span className={styles.materialSymbolsOutlined}>
                                keyboard_arrow_down
                            </span>
                        )}
                    </div>

                    <div>
                        {smccPrice.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        }) ||
                            (0).toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                            })}
                    </div>
                </li>

                {isOpen ? (
                    <ul className={styles.totalsSubUl}>
                        <li>
                            <div className={styles.totalsLabel}>
                                {selectedSizeLabor?.description ||
                                    "Labor - Build"}
                            </div>
                            <div>
                                {selectedSizeLabor?.price.toLocaleString(
                                    "en-US",
                                    {
                                        style: "currency",
                                        currency: "USD",
                                    }
                                ) ||
                                    (0).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                            </div>
                        </li>
                        <li>
                            <div className={styles.totalsLabel}>
                                Labor - Install
                            </div>
                            <div>
                                {installLabor?.price?.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }) ||
                                    (0).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                            </div>
                        </li>
                        <li>
                            <div className={styles.totalsLabel}>Freight</div>
                            <div>
                                {freight?.price?.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }) ||
                                    (0).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                            </div>
                        </li>
                        <li>
                            <div className={styles.totalsLabel}>
                                Consumables
                            </div>
                            <div>
                                {totalConsumables?.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }) ||
                                    (0).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                            </div>
                        </li>
                        <li>
                            <div className={styles.totalsLabel}>
                                Spare and Shipped Loose
                            </div>
                            <div>
                                {spareShippedLoosePrice.toLocaleString(
                                    "en-US",
                                    {
                                        style: "currency",
                                        currency: "USD",
                                    }
                                ) ||
                                    (0).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                            </div>
                        </li>
                        <li>
                            <div className={styles.totalsLabel}>
                                Non Variable Parts
                            </div>
                            <div>
                                {(nonVariablePartsPrice || 0).toLocaleString(
                                    "en-US",
                                    {
                                        style: "currency",
                                        currency: "USD",
                                    }
                                ) ||
                                    (0).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                            </div>
                        </li>
                        <li>
                            <div className={styles.totalsLabel}>
                                Variable Parts
                            </div>
                            <div>
                                {(assemblyPrice || 0).toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                }) ||
                                    (0).toLocaleString("en-US", {
                                        style: "currency",
                                        currency: "USD",
                                    })}
                            </div>
                        </li>
                    </ul>
                ) : (
                    ""
                )}

                <li className={styles.total}>
                    <span>TOTAL PRICE</span>
                    <span>
                        {(assemblyPrice + baseAssemblyPrice).toLocaleString(
                            "en-US",
                            {
                                style: "currency",
                                currency: "USD",
                            }
                        )}
                    </span>
                </li>
            </ul>
        </PageWide>
    );
}

export default Totals;
