document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    const output = document.getElementById("output");
    const btnObfuscate = document.getElementById("obfuscate");
    const btnCopy = document.getElementById("copy");
    const btnClear = document.getElementById("clear");

    // --- TUNED FOR ~5000 CHARACTERS ---
    const REAL_CHAINS = 2; // Keeps it compact
    const VAR_LEN = 20;    // Shorter vars (20 chars) to save space

    btnObfuscate.onclick = () => {
        const code = input.value;
        if (!code.trim()) return;

        try {
            let payload = code;

            // 1. Layer 1
            payload = createRealLayer(payload);

            // 2. Layer 2 (Final Layer)
            // We loop just enough to scramble it without making it huge
            for (let i = 0; i < REAL_CHAINS - 1; i++) {
                payload = createRealLayer(payload);
            }

            // 3. Inject Fake Chains (Dead Ends)
            payload = injectFakeChains(payload);

            // 4. Final Assembly
            let final = "-- Obfuscated by Zexon Development\n";
            final += payload;
            final += "\n-- Zexon Obfuscator";

            output.value = final;
        } catch (e) {
            console.error(e);
            output.value = "-- Error: " + e.message;
        }
    };

    btnCopy.onclick = () => {
        if (!output.value) return;
        navigator.clipboard.writeText(output.value);
        alert("Copied to clipboard!");
    };

    btnClear.onclick = () => {
        input.value = "";
        output.value = "";
    };

    // --- GENERATORS ---

    function getSymbols(len = 20) {
        // Reduced noise length to keep file size down
        const chars = "!@#$%^&*()_+=-[]{};':,.<>/?|`~"; 
        let res = "";
        for (let i = 0; i < len; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return res;
    }

    function getVar() {
        const prefix = "_";
        const chaos = ["l", "I", "1", "0", "O", "Z", "X"];
        let res = "";
        for (let i = 0; i < VAR_LEN; i++) {
             res += chaos[Math.floor(Math.random() * chaos.length)];
        }
        return prefix + res; 
    }

    // --- LOGIC ---

    function createRealLayer(innerCode) {
        const vTab = getVar();
        const vStr = getVar();
        const vFunc = getVar();
        const vKey = getVar();
        const vIdx = getVar();
        const vJunk = getVar();
        
        const keyVal = Math.floor(Math.random() * 255);
        const bytes = innerCode.split('').map(c => c.charCodeAt(0) ^ keyVal);
        const noise = getSymbols(30); 

        return `
local ${vJunk} = "${noise}"
local ${vKey} = ${keyVal}
local ${vTab} = {${bytes.join(',')}}
local ${vStr} = {}

-- Time Waster
for i=1, ${Math.floor(Math.random() * 10) + 2} do
    local _ = math.sin(i)
end

for ${vIdx} = 1, #${vTab} do
    table.insert(${vStr}, string.char(bit32.bxor(${vTab}[${vIdx}], ${vKey})))
end

local ${vFunc} = (loadstring or load)(table.concat(${vStr}))
if ${vFunc} then ${vFunc}() end
`;
    }

    function injectFakeChains(realPayload) {
        const vState = getVar();
        const vFake1 = getVar();
        
        return `
local ${vState} = 55

if ${vState} == 99 then
    -- [FAKE CHAIN]
    local ${vFake1} = "${getSymbols(50)}"
    print("Error")

elseif ${vState} == 55 then
    -- [REAL CHAIN]
    ${realPayload}

else
    error("${getSymbols(10)}")
end
`;
    }
});
