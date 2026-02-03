document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("input");
    const output = document.getElementById("output");
    const btnObfuscate = document.getElementById("obfuscate");
    const btnCopy = document.getElementById("copy");
    const btnClear = document.getElementById("clear");

    // --- Config ---
    const REAL_CHAINS = 10; 
    const FAKE_CHAINS = 3;
    const VAR_LEN = 60; // Extra long variable names

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

    // --- Generators ---

    // Generates syntax-safe symbol soup. NO comments allowed here.
    function getNoise(len = 100) {
        // Safe symbols that won't break strings
        const chars = "!@$%^&*()_+=-{}:<>?,./|~`"; 
        let res = "";
        for (let i = 0; i < len; i++) {
            res += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return res;
    }

    // Generates "Visual Hell" variable names
    function getVar() {
        const prefix = "_";
        const chaos = ["l", "I", "1", "0", "O", "Z", "X"];
        let res = "";
        for (let i = 0; i < VAR_LEN; i++) {
             res += chaos[Math.floor(Math.random() * chaos.length)];
        }
        return prefix + res + "_" + Math.floor(Math.random() * 999999).toString(16);
    }

    // --- Layer Logic ---

    function createRealLayer(innerCode) {
        const vTab = getVar();
        const vStr = getVar();
        const vFunc = getVar();
        const vKey = getVar();
        const vIdx = getVar();
        
        // Luau uses bit32 often, but standard Lua uses operators. 
        // We will use standard operators (xor) compatible with newer Luau.
        const keyVal = Math.floor(Math.random() * 120) + 1;
        
        // Encrypt the code into bytes
        const bytes = innerCode.split('').map(c => c.charCodeAt(0) ^ keyVal);
        
        // Massive noise strings to bloat file size
        const noise1 = getNoise(200);
        const noise2 = getNoise(200);

        return `
local ${vKey} = ${keyVal}
local ${vTab} = {${bytes.join(',')}}
local ${vStr} = {}

-- Fake Math Loop to waste time
local ${getVar()} = 1
while ${getVar()} > 100 do
   ${getVar()} = ${getVar()} % 5
end

for ${vIdx} = 1, #${vTab} do
    table.insert(${vStr}, string.char(bit32.bxor(${vTab}[${vIdx}], ${vKey})))
end

local ${vFunc} = (loadstring or load)(table.concat(${vStr}))
if ${vFunc} then ${vFunc}() end
`;
    }

    function injectFakeChains(realPayload) {
        // This wraps the real code in a control structure with 3 fake paths
        
        const vState = getVar();
        const vFake1 = getVar(); // Fake var
        const vFake2 = getVar(); // Fake var
        
        // We simply append the real payload but surround it with fake math nonsense
        
        return `
local ${vState} = (5 * 4) + 1 -- Logic leads to Real Path

if ${vState} == 999 then
    -- FAKE CHAIN 1
    local ${vFake1} = 0
    repeat
        ${vFake1} = ${vFake1} + math.random(1,9)
    until ${vFake1} > 999999
    print("${getNoise(20)}") 

elseif ${vState} == 888 then
    -- FAKE CHAIN 2
    local ${vFake2} = {}
    for i=1, 500 do
        table.insert(${vFake2}, string.char(math.random(33, 126)))
    end
    print("Error 404")

elseif ${vState} == 777 then
    -- FAKE CHAIN 3
    local x = math.pi * 500
    x = x ^ 2
    x = x % 5

else
    -- REAL CHAIN
    ${realPayload}
end
`;
    }
});
