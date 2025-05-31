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

type RiskReason = 'tsunami' | 'riverside' | 'mountain' | 'landslide' | 'forest';

type ResiliencePoll = {
  energy_cut: number;
  emergency_contact: 'City' | 'Company' | 'SEC' | 'Mine';
  emergency_causes: 'fire' | 'flood' | 'wind' | 'rain';
  is_risk_zone: boolean;
  risk_zone: Partial<Record<RiskReason, boolean>>;
};

type InputSubscription = Subscriber & Partial<EnergyPoll> & Partial<ResiliencePoll>;

export type { InputSubscription, RiskReason };
