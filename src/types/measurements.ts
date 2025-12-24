export interface MeasurementData {
  profile_name: string;
  measurement_type: string;
  measurement_unit: string;
  // Upper body
  neck: number | null;
  shoulder_width: number | null;
  chest: number | null;
  waist: number | null;
  sleeve_length: number | null;
  arm_hole: number | null;
  wrist: number | null;
  shirt_length: number | null;
  back_width: number | null;
  // Lower body
  hips: number | null;
  thigh: number | null;
  inseam: number | null;
  outseam: number | null;
  trouser_length: number | null;
  knee: number | null;
  calf: number | null;
  ankle: number | null;
  // Additional
  height: number | null;
  weight: number | null;
  notes: string;
  is_default: boolean;
}

export interface MeasurementField {
  key: keyof MeasurementData;
  label: string;
  description: string;
  placeholder: string;
  guide?: string;
}

export const upperBodyFields: MeasurementField[] = [
  { 
    key: "neck", 
    label: "Neck", 
    description: "Measure around the base of your neck",
    placeholder: "15.5",
    guide: "Wrap the tape around where your collar sits"
  },
  { 
    key: "shoulder_width", 
    label: "Shoulder Width", 
    description: "Measure from shoulder edge to shoulder edge across the back",
    placeholder: "18",
    guide: "Measure from the tip of one shoulder to the other"
  },
  { 
    key: "chest", 
    label: "Chest", 
    description: "Measure around the fullest part of your chest",
    placeholder: "40",
    guide: "Keep arms relaxed at sides"
  },
  { 
    key: "waist", 
    label: "Waist", 
    description: "Measure around your natural waistline",
    placeholder: "34",
    guide: "Find your natural waist by bending to the side"
  },
  { 
    key: "sleeve_length", 
    label: "Sleeve Length", 
    description: "Measure from shoulder point to wrist",
    placeholder: "33",
    guide: "Keep arm slightly bent at elbow"
  },
  { 
    key: "arm_hole", 
    label: "Arm Hole", 
    description: "Measure around the armhole opening",
    placeholder: "18",
    guide: "Measure around where your arm meets your shoulder"
  },
  { 
    key: "wrist", 
    label: "Wrist", 
    description: "Measure around your wrist bone",
    placeholder: "7",
    guide: "Measure where you wear your watch"
  },
  { 
    key: "shirt_length", 
    label: "Shirt Length", 
    description: "Measure from base of neck to desired hem",
    placeholder: "28",
    guide: "For shirts, measure to hip level"
  },
  { 
    key: "back_width", 
    label: "Back Width", 
    description: "Measure across the upper back between armholes",
    placeholder: "16",
    guide: "Measure 6 inches below the neck"
  },
];

export const lowerBodyFields: MeasurementField[] = [
  { 
    key: "hips", 
    label: "Hips", 
    description: "Measure around the fullest part of your hips",
    placeholder: "40",
    guide: "Stand with feet together"
  },
  { 
    key: "thigh", 
    label: "Thigh", 
    description: "Measure around the fullest part of your thigh",
    placeholder: "24",
    guide: "Measure at the highest point"
  },
  { 
    key: "inseam", 
    label: "Inseam", 
    description: "Measure from crotch to ankle bone",
    placeholder: "32",
    guide: "Stand straight with feet slightly apart"
  },
  { 
    key: "outseam", 
    label: "Outseam", 
    description: "Measure from waist to ankle along the outside",
    placeholder: "42",
    guide: "Measure from waist to where trousers end"
  },
  { 
    key: "trouser_length", 
    label: "Trouser Length", 
    description: "Measure from waist to desired trouser length",
    placeholder: "40",
    guide: "Include break at the shoe"
  },
  { 
    key: "knee", 
    label: "Knee", 
    description: "Measure around your knee",
    placeholder: "16",
    guide: "Measure with leg slightly bent"
  },
  { 
    key: "calf", 
    label: "Calf", 
    description: "Measure around the fullest part of your calf",
    placeholder: "15",
    guide: "Measure at the widest point"
  },
  { 
    key: "ankle", 
    label: "Ankle", 
    description: "Measure around your ankle bone",
    placeholder: "10",
    guide: "Measure just above the ankle bone"
  },
];

export const additionalFields: MeasurementField[] = [
  { 
    key: "height", 
    label: "Height", 
    description: "Your total height",
    placeholder: "70",
    guide: "Stand against a wall without shoes"
  },
  { 
    key: "weight", 
    label: "Weight", 
    description: "Your current weight (lbs)",
    placeholder: "165",
    guide: "For reference purposes only"
  },
];

export const initialMeasurementData: MeasurementData = {
  profile_name: "",
  measurement_type: "general",
  measurement_unit: "inches",
  neck: null,
  shoulder_width: null,
  chest: null,
  waist: null,
  sleeve_length: null,
  arm_hole: null,
  wrist: null,
  shirt_length: null,
  back_width: null,
  hips: null,
  thigh: null,
  inseam: null,
  outseam: null,
  trouser_length: null,
  knee: null,
  calf: null,
  ankle: null,
  height: null,
  weight: null,
  notes: "",
  is_default: false,
};
