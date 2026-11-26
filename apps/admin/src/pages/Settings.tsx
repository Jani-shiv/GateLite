import { Plus, Search, Filter, Download, Upload, User, Shield, Bell, Palette, Globe, CreditCard, Settings as SettingsIcon, Key, Moon, Sun, Save, AlertCircle, MessageSquare, Mail, Database } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Input';
import { useState } from 'react';

export function Settings() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'appearance' | 'billing' | 'security' | 'integrations'>('general');

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Globe },
  ];

  const handleSave = () => {
    // TODO: Implement save logic
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-ink">Settings</h1>
          <p className="text-ink/60 font-body mt-1">Manage your society settings and preferences</p>
        </div>
        <Button variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
          Save Changes
        </Button>
      </div>

      <div className="flex border-b-3 border-ink mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-6 py-3 font-body font-medium border-b-3 border-ink -mb-px transition-all duration-fast whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-ink border-ink'
                : 'text-ink/50 hover:text-ink'
            }`}
          >
            <span className="flex items-center gap-2">
              <tab.icon className="w-4 h-4" aria-hidden="true" />
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-6">Society Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Society Name" defaultValue="Green Valley Society" />
              <Input label="Address" defaultValue="SG Highway, Ahmedabad, Gujarat 380054" />
              <Input label="City" defaultValue="Ahmedabad" />
              <Input label="State" defaultValue="Gujarat" />
              <Input label="Pincode" defaultValue="380054" type="number" />
              <Select
                label="Plan"
                options={[
                  { value: 'free', label: 'Free' },
                  { value: 'pro', label: 'Pro' },
                  { value: 'enterprise', label: 'Enterprise' },
                ]}
                defaultValue="pro"
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-6">Working Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Gate Opens" type="time" defaultValue="06:00" />
              <Input label="Gate Closes" type="time" defaultValue="22:00" />
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-6">Escalation Policy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input label="Escalation Timeout (seconds)" type="number" defaultValue="30" />
              <Select
                label="Escalation Policy"
                options={[
                  { value: 'ALLOW', label: 'Allow Entry' },
                  { value: 'DENY', label: 'Deny Entry' },
                  { value: 'HOLD', label: 'Hold for Guard' },
                ]}
                defaultValue="HOLD"
              />
              <Input label="Photo Retention (days)" type="number" defaultValue="90" />
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-6">Notification Channels</h2>
            <div className="space-y-4">
              {[
                { label: 'Push Notifications', description: 'Send push notifications to residents', enabled: true },
                { label: 'SMS Notifications', description: 'Send SMS for critical alerts', enabled: true },
                { label: 'WhatsApp Notifications', description: 'Send WhatsApp messages', enabled: false },
                { label: 'Email Notifications', description: 'Send email summaries', enabled: true },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white border-3 border-ink rounded-[12px]">
                  <div>
                    <p className="font-medium font-body text-ink">{item.label}</p>
                    <p className="text-sm font-body text-ink/50">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 bg-ink/10 peer-focus:ring-4 peer-focus:ring-ink peer-focus:ring-offset-3 peer-focus:ring-offset-white rounded-[999px] peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-ink after:border-3 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mint"></div>
                  </label>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-6">Notification Templates</h2>
            <div className="space-y-4">
              <Button variant="secondary" size="md" leftIcon={<Plus className="w-4 h-4" />}>Add Template</Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Visitor Approved', channel: 'Push', variables: ['visitor_name', 'flat_number'] },
                  { name: 'Delivery Arrived', channel: 'SMS', variables: ['delivery_service', 'flat_number'] },
                  { name: 'Ticket Created', channel: 'Email', variables: ['ticket_id', 'category'] },
                  { name: 'Payment Due', channel: 'WhatsApp', variables: ['amount', 'due_date'] },
                ].map((item, index) => (
                  <div key={index} className="p-4 bg-white border-3 border-ink rounded-[12px]">
                    <p className="font-medium font-body text-ink">{item.name}</p>
                    <p className="text-sm font-body text-ink/50">Channel: {item.channel}</p>
                    <p className="text-sm font-body text-ink/50 mt-1">Variables: {item.variables.join(', ')}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-6">Theme Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 border-3 border-ink rounded-[12px]">
                <p className="font-medium font-body text-ink mb-2">Light Mode (Default)</p>
                <div className="p-4 bg-white border-3 border-ink rounded-[12px] text-center text-sm font-body text-ink/60">Preview</div>
              </div>
              <div className="p-4 border-3 border-ink rounded-[12px]">
                <p className="font-medium font-body text-ink mb-2">Dark Mode</p>
                <div className="p-4 bg-ink border-3 border-mint rounded-[12px] text-center text-sm font-body text-mint">Preview</div>
              </div>
              <div className="p-4 border-3 border-ink rounded-[12px]">
                <p className="font-medium font-body text-ink mb-2">Auto (System)</p>
                <div className="p-4 bg-white border-3 border-ink rounded-[12px] text-center text-sm font-body text-ink/60">Preview</div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="theme" defaultChecked className="w-4 h-4 accent-mint" />
                <span className="font-body text-ink">Light</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="theme" className="w-4 h-4 accent-mint" />
                <span className="font-body text-ink">Dark</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="theme" className="w-4 h-4 accent-mint" />
                <span className="font-body text-ink">System</span>
              </label>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-6">Color Theme</h2>
            <p className="text-ink/60 mb-4">Choose your society's accent color (affects badges, buttons, highlights)</p>
            <div className="flex flex-wrap gap-4">
              {[
                { name: 'Mint (Default)', color: 'bg-mint', text: 'text-ink' },
                { name: 'Sky', color: 'bg-sky', text: 'text-ink' },
                { name: 'Lilac', color: 'bg-lilac', text: 'text-ink' },
                { name: 'Peach', color: 'bg-peach', text: 'text-ink' },
                { name: 'Butter', color: 'bg-butter', text: 'text-ink' },
                { name: 'Rose', color: 'bg-rose', text: 'text-white' },
              ].map((theme) => (
                <button
                  key={theme.name}
                  className={`flex items-center gap-3 px-4 py-3 rounded-[12px] border-3 border-ink transition-all duration-fast ${theme.color} ${theme.text}`}
                >
                  <span className="w-6 h-6 rounded-[8px] border-3 border-ink" />
                  <span className="font-medium font-body">{theme.name}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-6">Billing Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input label="Monthly Maintenance Fee" type="number" defaultValue="2500" placeholder="₹" />
              <Input label="Late Fee (per month)" type="number" defaultValue="100" placeholder="₹" />
              <Input label="Grace Period (days)" type="number" defaultValue="10" />
              <Select
                label="Billing Cycle"
                options={[
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'quarterly', label: 'Quarterly' },
                  { value: 'yearly', label: 'Yearly' },
                ]}
                defaultValue="monthly"
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-6">Payment Gateway</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Payment Provider"
                options={[
                  { value: 'razorpay', label: 'Razorpay' },
                  { value: 'cashfree', label: 'Cashfree' },
                  { value: 'stripe', label: 'Stripe' },
                ]}
                defaultValue="razorpay"
              />
              <Input label="API Key" type="password" placeholder="Enter API key" />
              <Input label="API Secret" type="password" placeholder="Enter API secret" />
              <Input label="Webhook Secret" type="password" placeholder="Enter webhook secret" />
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-6">Access Control</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white border-3 border-ink rounded-[12px]">
                <div>
                  <p className="font-medium font-body text-ink">Two-Factor Authentication</p>
                  <p className="text-sm font-body text-ink/50">Require 2FA for admin accounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-11 h-6 bg-ink/10 peer-focus:ring-4 peer-focus:ring-ink peer-focus:ring-offset-3 peer-focus:ring-offset-white rounded-[999px] peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-ink after:border-3 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-mint"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-white border-3 border-ink rounded-[12px]">
                <div>
                  <p className="font-medium font-body text-ink">Session Timeout</p>
                  <p className="text-sm font-body text-ink/50">Auto-logout after inactivity</p>
                </div>
                <Select
                  options={[
                    { value: '15', label: '15 minutes' },
                    { value: '30', label: '30 minutes' },
                    { value: '60', label: '1 hour' },
                    { value: '120', label: '2 hours' },
                  ]}
                  defaultValue="30"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-white border-3 border-ink rounded-[12px]">
                <div>
                  <p className="font-medium font-body text-ink">Device Limit</p>
                  <p className="text-sm font-body text-ink/50">Max devices per user</p>
                </div>
                <Select
                  options={[
                    { value: '1', label: '1 device' },
                    { value: '3', label: '3 devices' },
                    { value: '5', label: '5 devices' },
                    { value: '10', label: '10 devices' },
                  ]}
                  defaultValue="3"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-6">API Security</h2>
            <div className="space-y-4">
              <Input label="API Rate Limit (requests/minute)" type="number" defaultValue="100" />
              <Input label="JWT Access Token Expiry" type="text" defaultValue="15m" />
              <Input label="JWT Refresh Token Expiry" type="text" defaultValue="30d" />
              <Button variant="secondary" size="md" leftIcon={<Key className="w-4 h-4" />}>Rotate Secrets</Button>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-bold font-heading text-ink mb-6">Third-Party Integrations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: 'SMS Gateway (MSG91)', description: 'Send SMS notifications', status: 'connected', icon: MessageSquare },
                { name: 'WhatsApp Business API', description: 'Send WhatsApp messages', status: 'disconnected', icon: MessageSquare },
                { name: 'Email Service (SendGrid)', description: 'Send email notifications', status: 'connected', icon: Mail },
                { name: 'Firebase Cloud Messaging', description: 'Push notifications', status: 'connected', icon: Bell },
                { name: 'Google Maps', description: 'Location services', status: 'connected', icon: Globe },
                { name: 'AWS S3 / MinIO', description: 'File storage', status: 'connected', icon: Database },
              ].map((item, index) => (
                <div key={index} className="p-4 bg-white border-3 border-ink rounded-[12px]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-ink/60" aria-hidden="true" />
                      <p className="font-medium font-body text-ink">{item.name}</p>
                    </div>
                    <span className={`badge badge-${item.status === 'connected' ? 'primary' : 'danger'}`}>
                      {item.status === 'connected' ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <p className="text-sm font-body text-ink/50 mb-3">{item.description}</p>
                  <Button
                    variant={item.status === 'connected' ? 'ghost' : 'primary'}
                    size="sm"
                    className="w-full"
                  >
                    {item.status === 'connected' ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}