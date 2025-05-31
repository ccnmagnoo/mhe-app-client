type Subscriber = {
  rut: string;
  name: string;
  fatherName: string;
  motherName: string;
  dir: string;
  city: string;
  email: string;
  phone?: string;
};
type EnergyPoll = {
  electricBill: number;
  electricity: number;
  gasBill: number;
  gasDuration: number;
};

type RiskZone = 'tsunami' | 'riverside' | 'landslide' | 'forest';
type DamageExperience = 'fire' | 'flood' | 'wind' | 'rain' | 'landslide';

type ResiliencePoll = {
  energy_cut: number;
  emergency_contact: 'City' | 'Company' | 'SEC' | 'Mine';
  damage_experience: Partial<Record<DamageExperience, boolean>>;
  is_risk_zone: boolean;
  risk_zone: Partial<Record<RiskZone, boolean>>;
};

type InputSubscription = Subscriber & Partial<EnergyPoll> & Partial<ResiliencePoll>;

export type { InputSubscription, RiskZone };
