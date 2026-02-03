document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    const output = document.getElementById("output");
    const btnObfuscate = document.getElementById("obfuscate");
    const btnCopy = document.getElementById("copy");
    const btnClear = document.getElementById("clear");

    // --- Configuration ---
    const REAL_CHAINS = 10; 
    const FAKE_CHAINS = 3;
    
    // This creates variables that are 50-80 characters long
    const VAR_LEN_MIN = 50; 
    const VAR_LEN_MAX = 80;

    btnObfuscate.onclick = () => {
        const code = input.value;
        if (!code.trim()) return;

        try {
            let payload = code;

            // 1. Apply 10 Real Layers of Encryption
            for (let i = 0; i < REAL_CHAINS; i++) {
                payload = createRealLayer(payload);
            }

            // 2. Wrap in the "Fake Chain" Logic (Dead ends)
            payload = injectFakeChains(payload);

            // 3. Final Assembly with Specific Comments
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

    // --- Generators ---

    // Generates intense symbol noise safe for Lua strings
    function getSymbols(len = 100) {
        // We use double quotes, so we just need to escape " and \
        // This includes every annoying symbol on the keyboard
        const chars = "!@#$%^&*()_+=-[]{};':,.<>/?|`~"; 
        let res = "";
        for (let i = 0; i < len; i++) {
            let c = chars.charAt(Math.floor(Math.random() * chars.length));
            res += c;
        }
        return res;
    }

    // Generates "Visual Hell" variable names (Il1l0O mixed)
    function getVar() {
        const prefix = "_";
        const chaos = ["l", "I", "1", "0", "O", "Z", "X", "8", "B"];
        let len = Math.floor(Math.random() * (VAR_LEN_MAX - VAR_LEN_MIN)) + VAR_LEN_MIN;
        let res = "";
        for (let i = 0; i < len; i++) {
             res += chaos[Math.floor(Math.random() * chaos.length)];
        }
        // Append hex to ensure uniqueness
        return prefix + res + "_" + Math.floor(Math.random() * 9999999).toString(16);
    }

    // --- Layer Logic ---

    function createRealLayer(innerCode) {
        const vTab = getVar();
        const vStr = getVar();
        const vFunc = getVar();
        const vKey = getVar();
        const vIdx = getVar();
        const vJunk = getVar(); // Junk variable for symbol soup
        
        const keyVal = Math.floor(Math.random() * 255);
        
        // Encrypt the code into bytes
        const bytes = innerCode.split('').map(c => c.charCodeAt(0) ^ keyVal);
        
        // NOISE GENERATION: We inject strings full of symbols
        const symbolSoup = getSymbols(Math.floor(Math.random() * 200) + 100);

        return `
local ${vJunk} = "${symbolSoup}" -- Junk String
local ${vKey} = ${keyVal}
local ${vTab} = {${bytes.join(',')}}
local ${vStr} = {}

-- Weird Math Loop
local ${getVar()} = 1234.567
while ${getVar()} > 0 do
   ${getVar()} = math.sin(${getVar()}) * 99
   if ${getVar()} < 0.5 then break end
end

for ${vIdx} = 1, #${vTab} do
    -- Bitwise XOR for Luau
    table.insert(${vStr}, string.char(bit32.bxor(${vTab}[${vIdx}], ${vKey})))
end

local ${vFunc} = (loadstring or load)(table.concat(${vStr}))
if ${vFunc} then ${vFunc}() end
`;
    }

    function injectFakeChains(realPayload) {
        const vState = getVar();
        const vFake1 = getVar();
        const vFake2 = getVar(); 
        const vReal = getVar();
        
        // Logic: (8 * 8) - 4 = 60. This is the key to the real chain.
        return `
local ${vState} = (8 * 8) - 4 

if ${vState} == 9999 then
    -- FAKE CHAIN 1 (Dead End)
    local ${vFake1} = "${getSymbols(300)}"
    ${vFake1} = string.rep(${vFake1}, 50)
    print("Error: ${getSymbols(20)}")

elseif ${vState} == 5555 then
    -- FAKE CHAIN 2 (Dead End)
    local ${vFake2} = {}
    for i=1, 9000 do
        table.insert(${vFake2}, math.random() * 1000)
    end
    error("${getSymbols(10)}")

elseif ${vState} == 60 then
    -- REAL CHAIN
    local ${vReal} = "${getSymbols(50)}" -- More Noise
    ${realPayload}

else
    -- FAKE CHAIN 3
    while true do end -- Infinite loop trap
end
`;
    }
});
