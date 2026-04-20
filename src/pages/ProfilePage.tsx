import ProfileHeaderCard from '../components/sections/ProfileHeaderCard';
import ProfileEcoImpact from '../components/sections/ProfileEcoImpact';
import ProfileSettingsList from '../components/sections/ProfileSettingsList';
import ProfileFavoriteScooter from '../components/sections/ProfileFavoriteScooter';

export default function ProfilePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">Profile</h1>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProfileHeaderCard />
          <ProfileEcoImpact />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <ProfileSettingsList />
          <ProfileFavoriteScooter />
        </div>
      </div>
    </div>
  );
}
