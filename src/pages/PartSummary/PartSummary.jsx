import { useSmcc } from "../../contexts/SmccContext";
import styles from "./PartsListRow.module.css";

import PageWide from "../../components/PageWide";
import TabNavigation from "../../components/TabNavigation";
import Button from "../../components/buttons/Button";
import LinkButton from "../../components/buttons/LinkButton";
import { XlsxButton } from "../../components/buttons/XlsxButton";

import { PartsListRow } from "./PartsListRow";

function PartSummary() {
    const { kitsData, optionsData, partsData, assembly, baseAssembly } =
        useSmcc();

    // Build a parts list from the assembly object with the parts numbers and their quantities
    let partsList = {};

    // Exclusion array of non-P21 compatible kits
    const p21ExcludeKitsArr = [
        "startStopTunnel",
        "startStopVacsPrep",
        "eStopForTunnel",
        "eStopWithLight",
        "horn",
        "STC-32",
        "STC-48",
        "STC-64",
        "STC-80",
        "STC-96",
        "STC-112",
        "STC-128",
        "smallLaborShip",
        "mediumLaborShip",
        "largeLaborShip",
        "xlargeLaborShip",
    ];

    // Build a parts list from the assembly object with the parts numbers and their quantities
    for (const k in assembly) {
        if (assembly[k] > 0) {
            const arr = kitsData.filter(
                (kit) =>
                    kit.id === k && p21ExcludeKitsArr.includes(kit.id) === false
            );
            const kit = arr[0];
            kit?.parts.forEach((part) => {
                const partID = Object.keys(part)[0];
                const qty = Object.values(part)[0];

                partsList[partID] =
                    partsList[partID] + assembly[k] * qty || assembly[k] * qty;
            });
        }
    }

    // Add parts from the baseAssembly object with the parts numbers and their quantities
    for (const k in baseAssembly) {
        if (baseAssembly[k] > 0) {
            const arr = optionsData.filter(
                (kit) =>
                    kit.id === k && p21ExcludeKitsArr.includes(kit.id) === false
            );
            const kit = arr[0];
            kit?.parts.forEach((part) => {
                const partID = Object.keys(part)[0];
                const qty = Object.values(part)[0];

                partsList[partID] =
                    partsList[partID] + baseAssembly[k] * qty ||
                    baseAssembly[k] * qty;
            });
        }
    }

    // Use the partsList object to filter the partsData array
    const selectedPartsArr = partsData.filter((part) => partsList[part.id] > 0);

    // Sort parts array by manufacturer name
    const sortedSelectedPartsArr = selectedPartsArr.slice().sort((a, b) => {
        const nameA = a.manufacturer.toUpperCase(); // ignore upper and lowercase
        const nameB = b.manufacturer.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });

    return (
        <PageWide>
            <TabNavigation>
                <LinkButton route={"/assemblyForm"}>Edit Inputs</LinkButton>
                <LinkButton route={"/kitSummary"}>Kit Summary</LinkButton>
                <Button isActive={false}>Part Summary</Button>
                <LinkButton route={"/totals"}>Totals</LinkButton>
                <XlsxButton />
            </TabNavigation>
            <h2>PART SUMMARY</h2>
            <ul>
                <div className={`${styles.listItem} ${styles.listHeader}`}>
                    <div className={styles.qtyCol}>Qty</div>
                    <div className={styles.partNumCol}>Part Num</div>
                    <div className={styles.partDescCol}>Description</div>
                    <div>Manufact.</div>
                    <div className={styles.currencyCol}>Price</div>
                    <div className={styles.currencyCol}>Total</div>
                </div>
                {sortedSelectedPartsArr.map((part) => (
                    <PartsListRow
                        part={part}
                        partsList={partsList}
                        key={part.id}
                    />
                ))}
            </ul>
        </PageWide>
    );
}

export default PartSummary;
