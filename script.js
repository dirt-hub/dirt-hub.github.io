document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    const output = document.getElementById("output");
    const btnObfuscate = document.getElementById("obfuscate");
    const btnCopy = document.getElementById("copy");
    const btnClear = document.getElementById("clear");

    // --- FINAL OPTIMIZED CONFIG ---
    // NO LOOPS. We only encode ONCE to prevent 41M character files.
    const VAR_LEN = 25; // Good balance of annoying vs size

    btnObfuscate.onclick = () => {
        const code = input.value;
        if (!code.trim()) return;

        try {
            // 1. Single Pass Encryption (The fix for size)
            let payload = createSingleChaosLayer(code);

            // 2. Inject Fake Chains around it
            payload = injectFakeChains(payload);

            // 3. Final Assembly
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
        return prefix + res + "_" + Math.floor(Math.random() * 999).toString(16);
    }

    // --- LOGIC ---

    function createSingleChaosLayer(innerCode) {
        const vTab = getVar();
        const vStr = getVar();
        const vFunc = getVar();
        const vKey = getVar();
        const vIdx = getVar();
        const vJunk = getVar(); // Visual noise variable
        
        // Random XOR Key
        const keyVal = Math.floor(Math.random() * 255);
        
        // Convert input to byte array
        const bytes = innerCode.split('').map(c => c.charCodeAt(0) ^ keyVal);
        
        // Add just enough noise to look scary, but not bloated
        const noise = getSymbols(40); 

        return `
local ${vJunk} = "${noise}"
local ${vKey} = ${keyVal}
local ${vTab} = {${bytes.join(',')}}
local ${vStr} = {}

-- [Fake Math Logic]
local ${getVar()} = 0
for i=1, ${Math.floor(Math.random() * 8) + 2} do
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
local ${vState} = 777

if ${vState} == 999 then
    -- [FAKE DEAD END]
    local ${vFake1} = "${getSymbols(50)}"
    print("Error 404")

elseif ${vState} == 777 then
    -- [REAL CHAIN]
    ${realPayload}

else
    -- [FAKE DEAD END]
    while true do end
end
`;
    }
});
