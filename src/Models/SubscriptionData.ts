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

type RiskReason = 'tsunami' | 'river' | 'mountain' | 'landslide';

type ResiliencePoll = {
  energy_cut: number;
  emergency_contact: 'City' | 'Company' | 'SEC' | 'Mine';
  emergency_causes: 'fire' | 'flood' | 'wind' | 'rain';
  risk_zone: boolean;
  risk_reason: Partial<Record<RiskReason, boolean>>;
};

export type InputSubscription = Subscriber &
  Partial<EnergyPoll> &
  Partial<ResiliencePoll>;
