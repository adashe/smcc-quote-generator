import { createContext, useState, useContext } from "react";

import kitsData from "../data/smccKits";
import optionsData from "../data/smccOptionsKits.json";
import partsData from "../data/smccParts";

const SmccContext = createContext();

// Build initial assembly object based on kits in kitsData
const initialAssembly = kitsData.reduce((prev, curr) => {
    prev[curr.id] = 0;
    return prev;
}, {});

const initialOptions = {};

// Build initial options assembly object based on kits in kitsData
const initialBaseAssembly = optionsData.reduce((prev, curr) => {
    prev[curr.id] = 0;
    return prev;
}, {});

const initialProjectInfo = { p21Num: 55555 };

// Calculate the price of each individual kit, for use in total price calculation and kits view
function calcKitPrice(kitID) {
    // Check in both kitsData and optionsData for the kit
    // Vulnerable to break if the data is differently organized (for different MCCs)
    let kArr = kitsData.filter((kit) => kit.id === kitID);
    if (kArr.length < 1) {
        kArr = optionsData.filter((kit) => kit.id === kitID);
    }
    const kit = kArr[0];

    // Cycle through kit parts array, use each part objects' key (ID) to look up in partsData, and sum the price
    let sum = 0;
    kit?.parts.forEach((part) => {
        const partID = Object.keys(part)[0];
        const qty = Object.values(part)[0];

        const pArr = partsData.filter((part) => part.id === partID);
        const p = pArr[0];
        sum += p?.price * qty || 0;
    });

    return sum;
}

function SmccProvider({ children }) {
    const [assembly, setAssembly] = useState(initialAssembly);
    // options stores the selections in the options form that will make up the baseAssembly object
    const [options, setOptions] = useState(initialOptions);
    // baseAssembly is the assembly object built out of selected options
    const [baseAssembly, setBaseAssembly] = useState(initialBaseAssembly);
    const [projectInfo, setProjectInfo] = useState(initialProjectInfo);

    function handleChangeAssembly(e) {
        const { name, value } = e.target;

        setAssembly((previous) => ({
            ...previous,
            [name]: Number(value),
        }));
    }

    function handleIncrementAssembly(kitID, value) {
        if (assembly[kitID] + value < 0) {
            return;
        }
        setAssembly((previous) => ({
            ...previous,
            [kitID]: assembly[kitID] + value,
        }));
    }

    function handleChangeOptions(e) {
        const { name, value } = e.target;

        // Use setOptions to control the dropdown form element
        setOptions((previous) => ({
            ...previous,
            [name]: value,
        }));

        // setAssembly with size and stc kits, resetting mutually exclusive options to 0
        if (name === "size") {
            const laborShipId = `${value}LaborShip`;
            setBaseAssembly((previous) => ({
                ...previous,
                ["small"]: 0,
                ["medium"]: 0,
                ["large"]: 0,
                ["xlarge"]: 0,
                ["smallLaborShip"]: 0,
                ["mediumLaborShip"]: 0,
                ["largeLaborShip"]: 0,
                ["xlargeLaborShip"]: 0,
                ["spareShippedLoose"]: 1,
                [value]: 1,
                [laborShipId]: 1,
            }));
        } else if (name === "stc") {
            setBaseAssembly((previous) => ({
                ...previous,
                ["STC-32"]: 0,
                ["STC-48"]: 0,
                ["STC-64"]: 0,
                ["STC-80"]: 0,
                ["STC-96"]: 0,
                ["STC-112"]: 0,
                ["STC-128"]: 0,
                ["spareShippedLoose"]: 1,
                [value]: 1,
            }));
        }
    }

    function handleChangeProjectInfo(e) {
        const { name, value } = e.target;

        setProjectInfo((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    return (
        <SmccContext.Provider
            value={{
                kitsData,
                optionsData,
                partsData,
                assembly,
                options,
                baseAssembly,
                projectInfo,
                handleChangeAssembly,
                handleIncrementAssembly,
                handleChangeOptions,
                handleChangeProjectInfo,
                calcKitPrice,
            }}
        >
            {children}
        </SmccContext.Provider>
    );
}

function useSmcc() {
    const context = useContext(SmccContext);
    if (context === undefined)
        throw new Error("SmccContext was used outside of the SmccProvider");
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { SmccProvider, useSmcc };
