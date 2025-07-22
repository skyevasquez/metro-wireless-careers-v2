const nodemailer = require('nodemailer');

// Store data
const storeData = {
    "Florida - Tampa Bay": {
        district_manager: "tampa.dm@metrowirelessplus.com",
        stores: [
            { code: "50MPL008", name: "Florida Ave", address: "14949 N Florida Ave", city: "TAMPA" },
            { code: "50MPL005", name: "Hillsborough", address: "2513 W Hillsborough Ave Ste 105", city: "TAMPA" },
            { code: "12349439", name: "Waters", address: "4339 W Waters Ave", city: "TAMPA" },
            { code: "50MPL004", name: "22nd Ave", address: "4725 22nd Ave S", city: "ST PETERSBURG" }
        ]
    },
    "Florida - North": {
        district_manager: "north.fl.dm@metrowirelessplus.com",
        stores: [
            { code: "70851486", name: "Newberry", address: "1025 NW 76TH BLVD", city: "Gainesville" },
            { code: "70814859", name: "Hwy 441", address: "10700 US Highway 441", city: "LEESBURG" },
            { code: "70851449", name: "Brooksville", address: "13035 Cortez Blvd", city: "BROOKSVILLE" },
            { code: "70851446", name: "Inverness", address: "2103 S US Highway 41", city: "INVERNESS" },
            { code: "70814854", name: "Citrus", address: "2199 Citrus Blvd # A", city: "LEESBURG" },
            { code: "70814857", name: "Eustis", address: "2812 S Bay St", city: "EUSTIS" },
            { code: "70851487", name: "Archer", address: "3800 Sw Archer Road Ste B", city: "Gainesville" },
            { code: "70851855", name: "Wildwood", address: "334 Shopping Center Dr", city: "WILDWOOD" },
            { code: "70849049", name: "Leesburg", address: "703 E Market St Ste C", city: "LEESBURG" },
            { code: "70814858", name: "14th St", address: "716 N 14Th St", city: "LEESBURG" }
        ]
    },
    "Florida - Central": {
        district_manager: "central.fl.dm@metrowirelessplus.com",
        stores: [
            { code: "70851445", name: "Spring Hill", address: "11202 Spring Hill Dr", city: "Spring Hill" },
            { code: "70814794", name: "N Palm Beach", address: "11585 Us Highway 1 Ste 303", city: "North Palm Beach" },
            { code: "70851447", name: "Commerical", address: "4385 Commercial Way", city: "Spring Hill" },
            { code: "70851448", name: "Homosassa", address: "4524 S Suncoast Blvd", city: "Homosassa" },
            { code: "70814856", name: "Tavares", address: "460 E Burleigh Blvd", city: "Tavares" },
            { code: "70851130", name: "Pembroke Rd", address: "6776 Pembroke Rd", city: "PEMBROKE PINES" }
        ]
    },
    "Florida - South": {
        district_manager: "south.fl.dm@metrowirelessplus.com",
        stores: [
            { code: "70814798", name: "Fort Pierce '2801'", address: "2801 N US Highway 1", city: "Fort Pierce" },
            { code: "70814795", name: "Kings", address: "4856 N Kings Hwy # 20", city: "Fort Pierce" },
            { code: "70849852", name: "Miami Beach", address: "7110 Indian Creek Dr", city: "MIAMI BEACH" },
            { code: "70814797", name: "Southgate", address: "7220 Southgate Blvd", city: "NORTH LAUDERDALE" },
            { code: "70814799", name: "Flagler", address: "7795 W Flagler St. Unit M57B", city: "MIAMI" },
            { code: "70811994", name: "Park", address: "8100 Park Blvd N", city: "Pinellas Park" },
            { code: "70851131", name: "NE 62nd", address: "910 NE 62nd St", city: "OAKLAND PARK" },
            { code: "70851778", name: "17th Ave", address: "12641 NW 17th Ave", city: "Miami" },
            { code: "70852199", name: "Marlins", address: "501 Marlins Way", city: "Miami" }
        ]
    },
    "Virginia": {
        district_manager: "virginia.dm@metrowirelessplus.com",
        stores: [
            { code: "70849048", name: "Fairfax One", address: "11112 Lee Hwy", city: "Fairfax" },
            { code: "70849044", name: "Chantilly", address: "13881F Metrotech Dr", city: "CHANTILLY" },
            { code: "70849045", name: "Centreville", address: "14200C Centreville Sq", city: "Centreville" },
            { code: "70849046", name: "Dulles Sterling", address: "21100 Dulles Town Cir Ste 186", city: "Sterling" },
            { code: "70849058", name: "Weems", address: "38 Weems Ln", city: "Winchester" },
            { code: "70849042", name: "Beauregard", address: "4810 Beauregard St", city: "Alexandria" },
            { code: "70849041", name: "Rose Hill", address: "6104 Rose Hill Dr", city: "Alexandria" },
            { code: "70849043", name: "Springfield", address: "6500 Springfield Mall Spc CA202", city: "SPRINGFIELD" },
            { code: "70849052", name: "Fairfax Two", address: "9679 Fairfax Blvd", city: "Fairfax" },
            { code: "70849051", name: "Manassas", address: "9878 Liberia Ave", city: "Manassas" },
            { code: "70849059", name: "Culpeper", address: "741 Dominion Sq Shopping Ctr", city: "Culpeper" }
        ]
    },
    "Maryland": {
        district_manager: "maryland.dm@metrowirelessplus.com",
        stores: [
            { code: "70849050", name: "Valley Mall", address: "17301 Valley Mall Rd Spc SL220", city: "Hagerstown" }
        ]
    },
    "West Virginia": {
        district_manager: "wv.dm@metrowirelessplus.com",
        stores: [
            { code: "70849060", name: "Martinsburg", address: "1315 EDWIN MILLER BLVD", city: "MARTINSBURG" },
            { code: "70849054", name: "Charles Town", address: "767 E WASHINGTON ST", city: "Charles Town" }
        ]
    }
};

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    if (event.httpMethod === 'GET') {
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: storeData
            })
        };
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: 'Method not allowed' })
    };
};