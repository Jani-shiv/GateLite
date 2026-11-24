import { Building2, Users, Bell, Shield, Clock, Palette, Save, Database, Globe } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { useState } from 'react';

export function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [societyName, setSocietyName] = useState('Green Valley Society');
  const [address, setAddress] = useState('Ahmedabad, Gujarat');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [escalationTime, setEscalationTime] = useState(30);
  const [retentionDays, setRetentionDays] = useState(90);
  const [workingHoursStart, setWorkingHoursStart] = useState('06:00');
  const [workingHoursEnd, setWorkingHoursEnd] = useState('22:00');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const tabs = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-ink">Settings</h1>
        <p className="text-ink/60 font-body mt-1">Configure society settings and preferences</p>
      </div>
      
      {/* Tab Navigation */}
      <Card padding="none" className="overflow-hidden">
        <div className="border-b-3 border-ink">
          <nav className="flex overflow-x-auto" role="tablist" aria-label="Settings tabs">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${tab.id}-panel`}
                  id={`${tab.id}-tab`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 font-body font-medium text-sm
                    border-b-3 transition-all duration-fast ease-out
                    ${isActive 
                      ? 'border-mint text-mint bg-mint/5' 
                      : 'border-transparent text-ink/60 hover:text-ink hover:bg-ink/3'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Tab Panels */}
        <div className="p-6">
          {/* General Tab */}
          <div role="tabpanel" id="general-panel" aria-labelledby="general-tab" hidden={activeTab !== 'general'}>
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-bold font-heading text-ink">Society Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium font-body text-ink mb-2">Society Name</label>
                  <input
                    type="text"
                    value={societyName}
                    onChange={(e) => setSocietyName(e.target.value)}
                    className="input"
                    placeholder="Enter society name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium font-body text-ink mb-2">Address</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input min-h-[100px] resize-y"
                    placeholder="Enter full address"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium font-body text-ink mb-2">Timezone</label>
                    <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className="select">
                      <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium font-body text-ink mb-2">Plan</label>
                    <select className="select">
                      <option value="starter">Starter (Free)</option>
                      <option value="standard">Standard</option>
                      <option value="pro" selected>Pro</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t-2 border-ink">
                <h2 className="text-xl font-bold font-heading text-ink mb-4">Gate Operations</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium font-body text-ink mb-2">Escalation Timeout (seconds)</label>
                    <input
                      type="number"
                      value={escalationTime}
                      onChange={(e) => setEscalationTime(Number(e.target.value))}
                      className="input"
                      min="10"
                      max="300"
                    />
                    <p className="text-xs text-ink/50 mt-1">Time before escalating to next resident/guard</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium font-body text-ink mb-2">Photo Retention (days)</label>
                    <input
                      type="number"
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(Number(e.target.value))}
                      className="input"
                      min="1"
                      max="365"
                    />
                    <p className="text-xs text-ink/50 mt-1">Visitor photos auto-deleted after this period</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium font-body text-ink mb-2">Working Hours Start</label>
                    <input
                      type="time"
                      value={workingHoursStart}
                      onChange={(e) => setWorkingHoursStart(e.target.value)}
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium font-body text-ink mb-2">Working Hours End</label>
                    <input
                      type="time"
                      value={workingHoursEnd}
                      onChange={(e) => setWorkingHoursEnd(e.target.value)}
                      className="input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t-2 border-ink flex justify-end">
                <button className="btn btn-primary btn-md flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
          
          {/* Notifications Tab */}
          <div role="tabpanel" id="notifications-panel" aria-labelledby="notifications-tab" hidden={activeTab !== 'notifications'}>
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-bold font-heading text-ink">Notification Channels</h2>
              
              <div className="space-y-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[12px] bg-mint/20 border-2 border-mint flex items-center justify-center">
                        <Bell className="w-5 h-5 text-mint" />
                      </div>
                      <div>
                        <h3 className="font-medium font-body text-ink">Push Notifications</h3>
                        <p className="text-sm text-ink/60">Real-time alerts via Firebase Cloud Messaging</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pushEnabled}
                        onChange={(e) => setPushEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-ink/10 peer-focus:ring-3 peer-focus:ring-ink peer-focus:ring-offset-3 peer-focus:ring-offset-lilac rounded-[999px] peer peer-checked:bg-mint peer-checked:border-3 peer-checked:border-ink after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-[22px] after:h-[22px] after:bg-white after:rounded-full after:border-3 after:border-ink after:shadow-chip after:transition-all after:duration-fast peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[12px] bg-sky/20 border-2 border-sky flex items-center justify-center">
                        <Globe className="w-5 h-5 text-sky" />
                      </div>
                      <div>
                        <h3 className="font-medium font-body text-ink">SMS Notifications</h3>
                        <p className="text-sm text-ink/60">Critical alerts via MSG91 SMS gateway</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smsEnabled}
                        onChange={(e) => setSmsEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-ink/10 peer-focus:ring-3 peer-focus:ring-ink peer-focus:ring-offset-3 peer-focus:ring-offset-lilac rounded-[999px] peer peer-checked:bg-mint peer-checked:border-3 peer-checked:border-ink after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-[22px] after:h-[22px] after:bg-white after:rounded-full after:border-3 after:border-ink after:shadow-chip after:transition-all after:duration-fast peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[12px] bg-lilac/20 border-2 border-lilac flex items-center justify-center">
                        <Database className="w-5 h-5 text-lilac" />
                      </div>
                      <div>
                        <h3 className="font-medium font-body text-ink">Email Notifications</h3>
                        <p className="text-sm text-ink/60">Weekly digests and reports via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={emailEnabled}
                        onChange={(e) => setEmailEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-ink/10 peer-focus:ring-3 peer-focus:ring-ink peer-focus:ring-offset-3 peer-focus:ring-offset-lilac rounded-[999px] peer peer-checked:bg-mint peer-checked:border-3 peer-checked:border-ink after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-[22px] after:h-[22px] after:bg-white after:rounded-full after:border-3 after:border-ink after:shadow-chip after:transition-all after:duration-fast peer-checked:after:translate-x-full"></div>
                    </label>
                  </div>
                </Card>
              </div>
              
              <div className="pt-6 border-t-2 border-ink">
                <h3 className="font-medium font-body text-ink mb-4">Default Notification Preferences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" defaultChecked />
                    <span className="font-body text-sm text-ink">Visitor arrival notifications</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" defaultChecked />
                    <span className="font-body text-sm text-ink">Delivery notifications</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" defaultChecked />
                    <span className="font-body text-sm text-ink">Ticket updates</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" defaultChecked />
                    <span className="font-body text-sm text-ink">SOS alerts</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" />
                    <span className="font-body text-sm text-ink">Weekly digest email</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" />
                    <span className="font-body text-sm text-ink">Maintenance reminders</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Security Tab */}
          <div role="tabpanel" id="security-panel" aria-labelledby="security-tab" hidden={activeTab !== 'security'}>
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-bold font-heading text-ink">Security Settings</h2>
              
              <Card>
                <h3 className="font-medium font-body text-ink mb-4">Access Control</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" defaultChecked />
                    <span className="font-body text-sm text-ink">Require OTP for all logins</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" defaultChecked />
                    <span className="font-body text-sm text-ink">Device binding (remember trusted devices)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" />
                    <span className="font-body text-sm text-ink">MFA for admin accounts</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" defaultChecked />
                    <span className="font-body text-sm text-ink">Audit log all admin actions</span>
                  </label>
                </div>
              </Card>
              
              <Card>
                <h3 className="font-medium font-body text-ink mb-4">Rate Limiting</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium font-body text-ink mb-2">OTP requests per 10 min</label>
                    <input type="number" value={3} className="input" min="1" max="10" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-body text-ink mb-2">OTP requests per hour per IP</label>
                    <input type="number" value={10} className="input" min="1" max="50" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-body text-ink mb-2">Login attempts before lockout</label>
                    <input type="number" value={5} className="input" min="3" max="20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium font-body text-ink mb-2">Lockout duration (minutes)</label>
                    <input type="number" value={15} className="input" min="5" max="120" />
                  </div>
                </div>
              </Card>
              
              <Card>
                <h3 className="font-medium font-body text-ink mb-4">Data Privacy</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" defaultChecked />
                    <span className="font-body text-sm text-ink">Encrypt phone numbers at rest</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" defaultChecked />
                    <span className="font-body text-sm text-ink">Encrypt ID documents at rest</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" defaultChecked />
                    <span className="font-body text-sm text-ink">Auto-purge visitor photos after retention period</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-mint border-2 border-ink rounded" defaultChecked />
                    <span className="font-body text-sm text-ink">Enable data export for residents (DPDP compliance)</span>
                  </label>
                </div>
              </Card>
            </div>
          </div>
          
          {/* Appearance Tab */}
          <div role="tabpanel" id="appearance-panel" aria-labelledby="appearance-tab" hidden={activeTab !== 'appearance'}>
            <div className="max-w-2xl space-y-6">
              <h2 className="text-xl font-bold font-heading text-ink">Appearance</h2>
              
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium font-body text-ink">Dark Mode</h3>
                    <p className="text-sm text-ink/60">Use system preference or force light/dark</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className={`btn btn-sm ${!darkMode ? 'btn-primary' : 'btn-ghost'}`}>Light</button>
                    <button className={`btn btn-sm ${darkMode ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setDarkMode(!darkMode)}>Dark</button>
                    <button className="btn btn-sm btn-ghost">System</button>
                  </div>
                </div>
              </Card>
              
              <Card>
                <h3 className="font-medium font-body text-ink mb-4">Theme Preview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white border-3 border-ink rounded-[12px]">
                    <h4 className="font-medium font-body text-ink mb-2">Light Mode</h4>
                    <div className="space-y-2">
                      <button className="btn btn-primary btn-sm w-full">Primary</button>
                      <button className="btn btn-secondary btn-sm w-full">Secondary</button>
                      <button className="btn btn-danger btn-sm w-full">Danger</button>
                      <button className="btn btn-ghost btn-sm w-full">Ghost</button>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-900 border-3 border-gray-300 rounded-[12px]">
                    <h4 className="font-medium font-body text-white mb-2">Dark Mode</h4>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-green-400 text-gray-900 border-2 border-gray-900 rounded-[12px] font-medium">Primary</button>
                      <button className="w-full px-4 py-2 bg-purple-400 text-gray-900 border-2 border-gray-900 rounded-[12px] font-medium">Secondary</button>
                      <button className="w-full px-4 py-2 bg-red-400 text-gray-900 border-2 border-gray-900 rounded-[12px] font-medium">Danger</button>
                      <button className="w-full px-4 py-2 bg-transparent text-white border-2 border-gray-400 rounded-[12px] font-medium">Ghost</button>
                    </div>
                  </div>
                </div>
              </Card>
              
              <Card>
                <h3 className="font-medium font-body text-ink mb-4">Language</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="radio" name="language" className="w-4 h-4 accent-mint border-2 border-ink" defaultChecked />
                    <span className="font-body text-sm text-ink">English</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="radio" name="language" className="w-4 h-4 accent-mint border-2 border-ink" />
                    <span className="font-body text-sm text-ink">Hindi</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 bg-ink/3 border-2 border-ink rounded-[12px] cursor-pointer">
                    <input type="radio" name="language" className="w-4 h-4 accent-mint border-2 border-ink" />
                    <span className="font-body text-sm text-ink">Gujarati</span>
                  </label>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}