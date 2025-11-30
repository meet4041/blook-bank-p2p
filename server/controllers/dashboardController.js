const Donor = require('../models/Donor');
const BloodRequest = require('../models/BloodRequest');
const User = require('../models/User');

exports.getDashboardStats = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    let stats = {};

    if (role === 'admin') {
      stats = await getAdminStats();
    } else if (role === 'hospital') {
      stats = await getHospitalStats(userId);
    } else {
      stats = await getUserStats(userId);
    }

    res.status(200).json({ success: true, data: stats });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ success: false, error: 'Server error fetching dashboard stats' });
  }
};

const getAdminStats = async () => {
  const [
    verifiedDonorsCount,
    pendingRequestsCount,
    totalHospitals,
    totalDonors,
    totalRequests, 
    recentDonors,
    recentRequests
  ] = await Promise.all([
    Donor.countDocuments({ verified: true }),
    BloodRequest.countDocuments({ status: 'pending' }),
    User.countDocuments({ role: 'hospital' }),
    Donor.countDocuments(),
    BloodRequest.countDocuments(), 
    Donor.find().sort({ createdAt: -1 }).limit(5),
    BloodRequest.find().populate('requestedBy', 'name').sort({ createdAt: -1 }).limit(5)
  ]);

  return {
    verifiedDonorsCount,
    pendingRequestsCount,
    totalHospitals,
    totalDonors,
    totalRequests,
    recentDonors,
    recentRequests,
    role: 'admin'
  };
};

const getHospitalStats = async (hospitalId) => {
  const [
    verifiedDonorsCount,
    pendingRequestsCount,
    myTotalDonors,
    myTotalRequests, 
    myRecentDonors,
    myPendingRequests
  ] = await Promise.all([
    Donor.countDocuments({ verified: true, addedBy: hospitalId }),
    BloodRequest.countDocuments({ status: 'pending', requestedBy: hospitalId }),
    Donor.countDocuments({ addedBy: hospitalId }),
    BloodRequest.countDocuments({ requestedBy: hospitalId }), 
    Donor.find({ addedBy: hospitalId }).sort({ createdAt: -1 }).limit(5),
    BloodRequest.find({ status: 'pending', requestedBy: hospitalId }).sort({ createdAt: -1 }).limit(5)
  ]);

  return {
    verifiedDonorsCount,
    pendingRequestsCount,
    myTotalDonors,
    myTotalRequests,
    myRecentDonors,
    myPendingRequests,
    role: 'hospital'
  };
};

const getUserStats = async (userId) => {
  const [
    verifiedDonorsCount,
    pendingRequestsCount,
    totalDonors,
    totalRequests, 
    availableDonorsByBloodGroup
  ] = await Promise.all([
    Donor.countDocuments({ verified: true }),
    BloodRequest.countDocuments({ status: 'pending' }),
    Donor.countDocuments(),
    BloodRequest.countDocuments(), 
    Donor.aggregate([
      { $match: { verified: true } },
      { $group: { _id: '$bloodGroup', count: { $sum: 1 } } }
    ])
  ]);

  return {
    verifiedDonorsCount,
    pendingRequestsCount,
    totalDonors,
    totalRequests, 
    availableDonorsByBloodGroup,
    role: 'user'
  };
};