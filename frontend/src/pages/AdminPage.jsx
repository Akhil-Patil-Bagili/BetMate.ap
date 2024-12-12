import React from 'react';

function AdminPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Admin Portal</h1>
            <p>Welcome to the Admin Portal. Manage your app here.</p>
            <div className="mt-6 space-y-4">
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Manage Matches
                </button>
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    Manage Users
                </button>
                <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700">
                    Insert Test Data
                </button>
            </div>
        </div>
    );
}

export default AdminPage;
