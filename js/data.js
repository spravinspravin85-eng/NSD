export const CATEGORIES = [
  'Supercar', 'Hypercar', 'Sports', 'Muscle', 'Drift',
  'Sedan', 'SUV', 'Offroad', 'Electric', 'Race'
];

export const PAINT_COLORS = [
  '#00f0ff', '#2979ff', '#ff1744', '#ff9100', '#00e676', '#d500f9',
  '#ffffff', '#181c24', '#ffd600', '#00bfa5', '#651fff', '#c0c8d6'
];

export const NEON_COLORS = [
  '#00f0ff', '#ff007f', '#00ff66', '#aa00ff', '#ffaa00', '#ffffff'
];

const REAL_ROSTER = {
  Supercar: [
    ['Ferrari 488 Pista', 340, 88, 90, 82, '#ff1744'],
    ['Ferrari F8 Tributo', 340, 87, 89, 80, '#ff1744'],
    ['Ferrari 296 GTB', 330, 89, 91, 84, '#ffd600'],
    ['Lamborghini Huracan STO', 310, 88, 94, 83, '#00f0ff'],
    ['Lamborghini Aventador SVJ', 350, 90, 87, 86, '#00e676'],
    ['Lamborghini Gallardo Superleggera', 325, 83, 86, 78, '#ff9100'],
    ['McLaren 720S', 341, 90, 91, 85, '#ff9100'],
    ['McLaren 765LT', 330, 92, 93, 86, '#c0c8d6'],
    ['McLaren Artura', 330, 86, 89, 82, '#00bfa5'],
    ['Porsche 911 GT3 RS (992)', 296, 86, 97, 82, '#ffffff'],
    ['Porsche 911 Turbo S', 330, 92, 90, 84, '#2979ff'],
    ['Audi R8 V10 Performance', 331, 86, 88, 80, '#181c24'],
    ['Ford GT (2017)', 348, 88, 92, 84, '#2979ff'],
    ['Chevrolet Corvette Z06 (C8)', 314, 87, 91, 81, '#ffd600'],
    ['Mercedes-AMG GT Black Series', 325, 87, 92, 83, '#ff9100'],
    ['Aston Martin Vantage F1 Edition', 314, 82, 88, 78, '#00bfa5'],
    ['Maserati MC20', 325, 86, 89, 80, '#2979ff'],
    ['Honda NSX Type S (NC1)', 307, 86, 90, 83, '#ff1744'],
    ['Nissan GT-R NISMO (R35)', 315, 89, 89, 84, '#ffffff'],
    ['Lotus Emira V6', 290, 80, 91, 76, '#00f0ff']
  ],
  Hypercar: [
    ['Bugatti Chiron Super Sport 300+', 440, 98, 86, 96, '#2979ff'],
    ['Bugatti Veyron 16.4 Super Sport', 431, 95, 84, 93, '#ff9100'],
    ['Bugatti Bolide', 380, 99, 98, 98, '#00f0ff'],
    ['Koenigsegg Jesko Absolut', 445, 97, 92, 97, '#ffffff'],
    ['Koenigsegg Agera RS', 435, 96, 90, 95, '#ff1744'],
    ['Koenigsegg Regera', 410, 95, 89, 96, '#d500f9'],
    ['Pagani Huayra R', 385, 94, 96, 92, '#c0c8d6'],
    ['Pagani Zonda Cinque', 355, 91, 95, 90, '#ffffff'],
    ['Ferrari LaFerrari', 352, 94, 94, 93, '#ff1744'],
    ['Ferrari SF90 Stradale', 340, 96, 93, 94, '#ff1744'],
    ['McLaren P1', 350, 94, 95, 94, '#ff9100'],
    ['McLaren Senna', 340, 93, 98, 91, '#00f0ff'],
    ['McLaren Speedtail', 403, 94, 87, 94, '#c0c8d6'],
    ['Porsche 918 Spyder', 345, 95, 95, 93, '#c0c8d6'],
    ['Aston Martin Valkyrie', 402, 97, 99, 95, '#00bfa5'],
    ['Mercedes-AMG ONE', 352, 95, 97, 94, '#c0c8d6'],
    ['Lamborghini Revuelto', 350, 95, 93, 93, '#ff9100'],
    ['Lamborghini Veneno', 355, 92, 93, 91, '#181c24'],
    ['Hennessey Venom F5', 438, 96, 87, 95, '#ffd600'],
    ['SSC Tuatara', 435, 96, 86, 95, '#ffffff']
  ],
  Sports: [
    ['Toyota GR Supra (A90)', 275, 78, 84, 76, '#ffd600'],
    ['Toyota Supra MK4 (A80)', 285, 80, 82, 84, '#ff9100'],
    ['Nissan Skyline GT-R R34 V-Spec', 280, 82, 87, 83, '#2979ff'],
    ['Nissan Skyline GT-R R32', 268, 79, 85, 79, '#181c24'],
    ['Nissan Z (RZ34)', 265, 76, 82, 75, '#ffd600'],
    ['Nissan 370Z NISMO', 255, 74, 83, 74, '#ffffff'],
    ['Mazda RX-7 Spirit R (FD3S)', 265, 77, 89, 80, '#ff1744'],
    ['Mazda MX-5 Miata (ND)', 225, 66, 90, 68, '#ff1744'],
    ['Honda Civic Type R (FL5)', 275, 76, 88, 75, '#ffffff'],
    ['Honda S2000 CR', 248, 73, 88, 72, '#00f0ff'],
    ['Subaru WRX STI 22B', 255, 79, 87, 77, '#2979ff'],
    ['Mitsubishi Lancer Evo IX MR', 258, 80, 88, 78, '#ff1744'],
    ['BMW M4 Competition (G82)', 290, 84, 86, 80, '#00e676'],
    ['BMW M2 CS (F87)', 280, 82, 88, 78, '#2979ff'],
    ['Porsche 718 Cayman GT4 RS', 315, 85, 94, 81, '#00f0ff'],
    ['Audi TT RS', 280, 83, 84, 77, '#00e676'],
    ['Alpine A110 R', 285, 80, 92, 76, '#2979ff'],
    ['Toyota GR86', 235, 69, 87, 70, '#ff1744'],
    ['Acura Integra Type R (DC2)', 240, 70, 86, 70, '#ffd600'],
    ['Volkswagen Golf R (Mk8)', 270, 78, 84, 74, '#2979ff']
  ],
  Muscle: [
    ['Dodge Challenger SRT Hellcat Redeye', 326, 87, 74, 86, '#ff1744'],
    ['Dodge Charger SRT Hellcat', 315, 85, 73, 84, '#181c24'],
    ['Dodge Viper ACR', 285, 87, 94, 85, '#ffffff'],
    ['Ford Mustang Shelby GT500', 290, 88, 82, 85, '#2979ff'],
    ['Ford Mustang Dark Horse', 270, 81, 83, 78, '#00f0ff'],
    ['Ford Mustang Boss 429 (1969)', 245, 78, 68, 76, '#181c24'],
    ['Chevrolet Camaro ZL1 1LE', 318, 86, 87, 84, '#ffd600'],
    ['Chevrolet Chevelle SS 454 (1970)', 240, 79, 66, 76, '#ff1744'],
    ['Chevrolet Corvette Stingray (C2)', 242, 74, 72, 72, '#2979ff'],
    ['Plymouth Hemi Cuda (1971)', 248, 80, 67, 78, '#d500f9'],
    ['Plymouth Road Runner Superbird', 265, 78, 69, 77, '#00f0ff'],
    ['Pontiac GTO Judge (1969)', 238, 76, 68, 74, '#ff9100'],
    ['Pontiac Firebird Trans Am', 235, 73, 70, 72, '#181c24'],
    ['Shelby Cobra 427', 265, 85, 76, 80, '#2979ff'],
    ['Cadillac CT5-V Blackwing', 322, 85, 82, 82, '#181c24'],
    ['Buick GNX (1987)', 240, 79, 71, 76, '#181c24'],
    ['AMC Javelin AMX', 232, 74, 69, 72, '#ff1744'],
    ['Oldsmobile 442 W-30', 234, 75, 68, 73, '#ffd600'],
    ['Dodge Charger R/T (1969)', 244, 78, 67, 77, '#ff9100'],
    ['Equus Bass 770', 320, 86, 78, 83, '#c0c8d6']
  ],
  Drift: [
    ['Nissan Silvia S15 Spec-R Drift', 275, 80, 96, 85, '#00f0ff'],
    ['Nissan Silvia S14 Kouki', 265, 78, 94, 83, '#d500f9'],
    ['Nissan 240SX (S13)', 258, 76, 93, 81, '#ff007f'],
    ['Toyota Sprinter Trueno AE86', 235, 70, 95, 76, '#ffffff'],
    ['Toyota Chaser JZX100 Tourer V', 278, 81, 92, 84, '#ffffff'],
    ['Toyota Mark II JZX90', 272, 79, 91, 82, '#00bfa5'],
    ['Toyota GR Yaris Drift Spec', 265, 82, 94, 83, '#ff1744'],
    ['Mazda RX-7 FC3S Savanna', 255, 76, 93, 80, '#ffffff'],
    ['Mazda RX-8 Spirit R', 250, 74, 91, 78, '#2979ff'],
    ['Nissan 350Z Twin-Turbo Drift', 280, 82, 94, 85, '#ff9100'],
    ['Nissan 180SX Type X', 260, 77, 93, 82, '#ffd600'],
    ['BMW M3 E36 Euro Drift', 268, 79, 92, 81, '#d500f9'],
    ['BMW M3 E46 GTR Drift', 282, 82, 94, 84, '#00f0ff'],
    ['Ford Mustang RTR Spec 5-D', 305, 88, 96, 90, '#00e676'],
    ['Subaru BRZ Rocket Bunny', 262, 77, 93, 81, '#2979ff'],
    ['Lexus SC300 2JZ Drift', 284, 83, 91, 85, '#181c24'],
    ['Infiniti G35 Coupe Drift', 270, 79, 91, 82, '#c0c8d6'],
    ['Honda Civic EG6 RWD Swap', 252, 76, 92, 80, '#ffd600'],
    ['Nissan Laurel C33', 264, 78, 90, 81, '#00bfa5'],
    ['Toyota Soarer Z30', 276, 80, 91, 83, '#ff1744']
  ],
  Sedan: [
    ['BMW M5 CS (F90)', 305, 88, 84, 82, '#00bfa5'],
    ['Mercedes-AMG E63 S', 300, 87, 82, 81, '#181c24'],
    ['Audi RS6 Avant', 305, 87, 83, 81, '#c0c8d6'],
    ['Audi RS7 Sportback', 305, 87, 83, 82, '#2979ff'],
    ['Porsche Panamera Turbo S', 315, 89, 85, 83, '#ffffff'],
    ['Alfa Romeo Giulia Quadrifoglio', 307, 84, 87, 80, '#ff1744'],
    ['Lexus IS 500 F Sport', 265, 76, 80, 74, '#00f0ff'],
    ['Lexus GS F', 270, 77, 81, 75, '#ff9100'],
    ['Maserati Quattroporte Trofeo', 326, 84, 79, 80, '#2979ff'],
    ['Aston Martin Rapide AMR', 330, 84, 81, 81, '#00e676'],
    ['Bentley Flying Spur Speed', 333, 86, 76, 82, '#181c24'],
    ['Rolls-Royce Ghost Black Badge', 250, 78, 72, 75, '#181c24'],
    ['Jaguar XE SV Project 8', 322, 87, 88, 83, '#ff9100'],
    ['Genesis G70 3.3T Sport', 270, 77, 81, 74, '#c0c8d6'],
    ['Kia Stinger GT2', 270, 76, 80, 74, '#ff1744'],
    ['Acura TLX Type S', 255, 75, 80, 73, '#2979ff'],
    ['Volvo S60 Polestar Engineered', 250, 77, 81, 74, '#ffffff'],
    ['Skoda Octavia RS', 250, 72, 79, 70, '#00e676'],
    ['Mercedes-Maybach S680', 250, 79, 70, 76, '#c0c8d6'],
    ['BMW M340i xDrive', 265, 79, 83, 76, '#2979ff']
  ],
  SUV: [
    ['Lamborghini Urus Performante', 306, 87, 82, 83, '#ffd600'],
    ['Ferrari Purosangue', 310, 88, 84, 84, '#ff1744'],
    ['Aston Martin DBX707', 310, 88, 83, 84, '#00bfa5'],
    ['Porsche Cayenne Turbo GT', 300, 88, 85, 83, '#c0c8d6'],
    ['BMW X5 M Competition', 290, 85, 80, 80, '#2979ff'],
    ['BMW X6 M Competition', 290, 85, 80, 80, '#181c24'],
    ['Mercedes-AMG G63', 240, 80, 68, 78, '#181c24'],
    ['Mercedes-AMG GLE 63 S', 280, 84, 79, 79, '#ffffff'],
    ['Audi RS Q8', 305, 86, 82, 82, '#00e676'],
    ['Jeep Grand Cherokee Trackhawk', 290, 87, 74, 83, '#ff1744'],
    ['Dodge Durango SRT Hellcat', 290, 86, 73, 83, '#181c24'],
    ['Range Rover Sport SV', 290, 84, 79, 80, '#c0c8d6'],
    ['Bentley Bentayga Speed', 306, 85, 77, 81, '#2979ff'],
    ['Maserati Levante Trofeo', 302, 84, 79, 80, '#2979ff'],
    ['Alfa Romeo Stelvio Quadrifoglio', 283, 84, 84, 79, '#ff1744'],
    ['Ford Explorer ST', 245, 74, 75, 72, '#00f0ff'],
    ['Toyota Fortuner GR-S', 210, 66, 70, 68, '#ffffff'],
    ['Mahindra XUV700 AX7L', 215, 68, 72, 68, '#2979ff'],
    ['Tata Harrier Dark Edition', 205, 65, 71, 66, '#181c24'],
    ['Land Rover Defender V8', 240, 78, 72, 76, '#00bfa5']
  ],
  Offroad: [
    ['Mahindra Thar ROXX MX1D', 195, 68, 74, 70, '#181c24'],
    ['Ford F-150 Raptor R', 225, 82, 74, 80, '#ff9100'],
    ['Ford Bronco Raptor', 210, 78, 76, 77, '#00f0ff'],
    ['RAM 1500 TRX', 220, 84, 72, 82, '#ff1744'],
    ['Jeep Wrangler Rubicon 392', 205, 79, 73, 77, '#ffd600'],
    ['Toyota Land Cruiser GR Sport', 215, 74, 73, 74, '#ffffff'],
    ['Toyota Hilux Arctic Trucks AT35', 195, 68, 72, 72, '#ff1744'],
    ['Mercedes-Benz G500 4x4 Squared', 210, 76, 70, 76, '#00e676'],
    ['Local Motors Rally Fighter', 240, 81, 82, 82, '#c0c8d6'],
    ['Ariel Nomad R', 230, 86, 89, 81, '#ff9100'],
    ['Porsche 911 Dakar', 240, 85, 88, 81, '#ffffff'],
    ['Lamborghini Huracan Sterrato', 260, 87, 89, 83, '#00bfa5'],
    ['Subaru Crosstrek Desert Racer', 215, 75, 83, 76, '#2979ff'],
    ['Mitsubishi Pajero Evolution', 210, 74, 80, 75, '#ffffff'],
    ['Suzuki Jimny Sierra Off-Road', 175, 62, 78, 66, '#00e676'],
    ['Force Gurkha 4x4 Extreme', 170, 60, 72, 65, '#ff9100'],
    ['Isuzu D-Max V-Cross', 190, 65, 71, 68, '#2979ff'],
    ['Bowler Bulldog V8', 225, 80, 81, 79, '#181c24'],
    ['Chevrolet Colorado ZR2 Bison', 205, 73, 75, 74, '#ffd600'],
    ['Nissan Patrol NISMO', 220, 76, 74, 76, '#ffffff']
  ],
  Electric: [
    ['Rimac Nevera', 412, 99, 92, 98, '#00f0ff'],
    ['Pininfarina Battista', 350, 99, 93, 97, '#2979ff'],
    ['Lotus Evija', 350, 98, 95, 97, '#ffd600'],
    ['Tesla Model S Plaid', 322, 98, 82, 92, '#ffffff'],
    ['Tesla Roadster (Gen 2)', 402, 99, 90, 96, '#ff1744'],
    ['Porsche Taycan Turbo GT', 305, 96, 89, 91, '#d500f9'],
    ['Audi e-tron GT RS', 255, 90, 86, 86, '#c0c8d6'],
    ['Lucid Air Sapphire', 330, 98, 85, 93, '#2979ff'],
    ['NIO EP9', 313, 95, 97, 94, '#00f0ff'],
    ['Aspark Owl', 400, 99, 92, 97, '#181c24'],
    ['Hyundai Ioniq 5 N', 260, 88, 88, 85, '#00f0ff'],
    ['Kia EV6 GT', 260, 87, 84, 83, '#00e676'],
    ['BMW i4 M50', 240, 84, 82, 80, '#2979ff'],
    ['Mercedes-AMG EQS 53', 250, 86, 79, 82, '#181c24'],
    ['GMC Hummer EV Edition 1', 180, 88, 65, 84, '#ffffff'],
    ['Rivian R1T Quad-Motor', 200, 89, 73, 84, '#00bfa5'],
    ['Ford Mustang Mach-E GT', 220, 84, 79, 79, '#ff9100'],
    ['Polestar 1', 250, 83, 84, 80, '#c0c8d6'],
    ['Maserati GranTurismo Folgore', 325, 92, 87, 88, '#2979ff'],
    ['Mahindra BE 6e Formula Edition', 235, 84, 83, 82, '#ff1744']
  ],
  Race: [
    ['Ferrari 499P Le Mans Hypercar', 345, 96, 99, 95, '#ff1744'],
    ['Porsche 963 LMDh', 340, 95, 99, 94, '#ffffff'],
    ['Toyota GR010 Hybrid', 340, 95, 98, 94, '#ff1744'],
    ['Mazda 787B Group C', 355, 94, 97, 94, '#ff9100'],
    ['Sauber Mercedes C9', 370, 94, 96, 94, '#c0c8d6'],
    ['Porsche 911 GT3 R (992)', 305, 89, 98, 86, '#00e676'],
    ['Ferrari 296 GT3', 305, 89, 98, 86, '#ff1744'],
    ['Lamborghini Huracan GT3 EVO2', 305, 89, 97, 86, '#00e676'],
    ['BMW M4 GT3', 305, 88, 97, 85, '#2979ff'],
    ['McLaren 720S GT3X', 320, 91, 98, 88, '#ff9100'],
    ['Aston Martin Valkyrie AMR Pro', 365, 97, 100, 96, '#00bfa5'],
    ['Pagani Zonda R', 375, 96, 99, 95, '#181c24'],
    ['Ferrari FXX-K Evo', 360, 96, 99, 96, '#ff1744'],
    ['Lamborghini Essenza SCV12', 350, 95, 98, 94, '#00e676'],
    ['Brabham BT62', 340, 94, 99, 92, '#2979ff'],
    ['Ford GT Mk IV Track Edition', 355, 95, 98, 93, '#00f0ff'],
    ['Nissan GT-R NISMO GT3', 305, 88, 96, 85, '#ffffff'],
    ['Audi R8 LMS GT3 evo II', 305, 88, 97, 85, '#ffd600'],
    ['Chevrolet Corvette C8.R', 305, 88, 97, 85, '#ffd600'],
    ['Formula E Gen3 Evo', 322, 97, 99, 95, '#00f0ff']
  ]
};

export const VEHICLES = (() => {
  const list = [];
  let id = 0;

  CATEGORIES.forEach(category => {
    const models = REAL_ROSTER[category];
    models.forEach(([name, topSpeed, accel, handling, nitro, defaultColor], idx) => {
      const isStarter = idx === 0 && id < 120;
      const tier = Math.floor(idx / 2);

      list.push({
        id,
        name,
        category,
        price: isStarter ? 0 : (tier + 1) * 14500 + (idx % 3) * 2500,
        topSpeed,
        accel,
        handling,
        nitro,
        defaultColor,
        bodyShape: {
          width: (category === 'SUV' || category === 'Offroad') ? 2.16 : 1.98,
          height: (category === 'SUV' || category === 'Offroad') ? 1.56 : ((category === 'Hypercar' || category === 'Race') ? 1.10 : 1.25),
          length: (category === 'Muscle' || category === 'Sedan') ? 4.76 : 4.46,
          cabinOffset: (category === 'Hypercar' || category === 'Race') ? 0.16 : -0.08,
          defaultSpoiler: (category === 'Race' || category === 'Drift') ? 2 : (category === 'Supercar' || category === 'Hypercar' ? 1 : 0)
        }
      });
      id++;
    });
  });

  return list;
})();

export const UPGRADE_TYPES = [
  { key: 'engine', name: 'Twin-Turbo Engine Block', desc: '+12 km/h Top Speed per level', cost: 4000 },
  { key: 'transmission', name: 'Sequential Race Gearbox', desc: '+6% Acceleration & faster shifts', cost: 3500 },
  { key: 'tires', name: 'Semi-Slick Compound Tires', desc: '+7% Cornering Grip & Drift Control', cost: 3000 },
  { key: 'suspension', name: 'Coilover Track Suspension', desc: 'Reduces body roll & sharpens turn-in', cost: 2800 },
  { key: 'brakes', name: 'Carbon-Ceramic Brakes', desc: 'Shorter braking distance into hairpins', cost: 2500 },
  { key: 'nitro', name: 'Cryo-Nitrous Injection', desc: '+15% Boost thrust & faster recharge', cost: 3800 }
];

export const DEFAULT_MISSIONS = [
  { id: 'm1', title: 'Street Rookie: Win 1 Race', target: 1, reward: 5000, type: 'wins' },
  { id: 'm2', title: 'Sideways King: Score 10,000 Drift Pts', target: 10000, reward: 7500, type: 'drift' },
  { id: 'm3', title: 'Highway Demon: Drive 15 km', target: 15, reward: 6000, type: 'distance' },
  { id: 'm4', title: 'Collector: Own 8 Vehicles', target: 8, reward: 15000, type: 'cars' }
];
