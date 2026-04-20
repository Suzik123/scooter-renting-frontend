import { Link } from 'react-router-dom';
import {
  ChevronRight,
  User,
  Bell,
  Shield,
  CreditCard,
  Moon,
  Globe,
  MapPin,
  HelpCircle,
  MessageCircle,
  FileText,
  LogOut,
  Bike,
  Leaf,
} from 'lucide-react';
import { currentUser, userStats } from '../mock/data';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const accountSettings = [
  { icon: User, label: 'Personal Information' },
  { icon: Shield, label: 'Security & Privacy' },
  { icon: CreditCard, label: 'Payment Methods' },
  { icon: Bell, label: 'Notifications' },
];

const appPreferences = [
  { icon: Moon, label: 'Appearance' },
  { icon: Globe, label: 'Language & Region' },
  { icon: MapPin, label: 'Location Settings' },
];

const support = [
  { icon: HelpCircle, label: 'Help Center' },
  { icon: MessageCircle, label: 'Contact Support' },
  { icon: FileText, label: 'Terms & Conditions' },
];

export default function ProfilePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-white">{currentUser.initials}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">{currentUser.name}</h2>
            <p className="text-sm text-slate-500 mb-2">{currentUser.email}</p>
            <Badge variant="success" className="mb-4">
              {currentUser.verified ? 'Verified' : 'Unverified'}
            </Badge>
            <p className="text-xs text-slate-400 mb-4">Member since {currentUser.memberSince}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
              <div>
                <p className="text-lg font-bold text-slate-900">{userStats.totalRides}</p>
                <p className="text-xs text-slate-500">Rides</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{userStats.totalDistance}</p>
                <p className="text-xs text-slate-500">Distance</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">{userStats.totalSpent}</p>
                <p className="text-xs text-slate-500">Spent</p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Button fullWidth variant="outline">Edit Profile</Button>
              <Link to="/login">
                <Button fullWidth variant="ghost" className="text-red-500 hover:bg-red-50 hover:text-red-600">
                  <LogOut size={16} className="mr-2" /> Log Out
                </Button>
              </Link>
            </div>
          </div>

          {/* Eco Impact - desktop */}
          <div className="hidden lg:block mt-6 bg-gradient-to-br from-primary-light to-white rounded-xl border border-green-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Leaf size={18} className="text-primary" />
              <h3 className="font-semibold text-slate-900">Eco Impact</h3>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600">CO2 Saved</span>
                  <span className="font-semibold text-slate-900">{userStats.co2Saved}</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-primary rounded-full h-2 w-[71%]" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-600">Green Rides</span>
                  <span className="font-semibold text-slate-900">47 / 50</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-primary rounded-full h-2 w-[94%]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-semibold text-slate-900 mb-3 px-1">Account Settings</h3>
            <div className="space-y-1">
              {accountSettings.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <item.icon size={18} className="text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>
              ))}
            </div>
          </div>

          {/* App Preferences */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-semibold text-slate-900 mb-3 px-1">App Preferences</h3>
            <div className="space-y-1">
              {appPreferences.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <item.icon size={18} className="text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <h3 className="font-semibold text-slate-900 mb-3 px-1">Support</h3>
            <div className="space-y-1">
              {support.map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <item.icon size={18} className="text-slate-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>
              ))}
            </div>
          </div>

          {/* Favorite Scooter - mobile */}
          <div className="lg:hidden bg-white rounded-xl shadow-sm border border-slate-100 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                <Bike size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Favorite Scooter</p>
                <p className="font-semibold text-sm text-slate-900">{userStats.favoriteScooter}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
