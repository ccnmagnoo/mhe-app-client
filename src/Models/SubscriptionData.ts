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

type ResiliencePoll = {
  energy_cut: number;
  emergency_contact: 'City' | 'Company' | 'SEC' | 'Mine';
  emergency_causes: 'fire' | 'flood' | 'wind' | 'rain';
  risk_zone: boolean;
  risk_reason: 'tsunami' | 'river' | 'mountain' | 'landslide';
};

export type InputSubscription = Subscriber &
  Partial<EnergyPoll> &
  Partial<ResiliencePoll>;
