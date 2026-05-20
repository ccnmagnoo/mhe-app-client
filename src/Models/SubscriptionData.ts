type Subscriber = {
  rut: string;
  name: string;
  fatherName: string;
  motherName: string;
  dir: string;
  city: string;
  email: string;
  phone?: string;
  isIndigenous: boolean;
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
  is_risk_zone: boolean;
  risk_zone: Partial<Record<RiskZone, boolean>>;
  has_damage_experience: boolean;
  damage_experience: Partial<Record<DamageExperience, boolean>>;
};

type InputSubscription = Subscriber & Partial<EnergyPoll> & Partial<ResiliencePoll>;

export type { InputSubscription, RiskZone, DamageExperience, EnergyPoll, ResiliencePoll };
