const { prisma } = require('../config/db');

async function getDeliveryZones(req, res) {
  try {
    const zones = await prisma.deliveryConfig.findMany({
      where: { isActive: true },
    });
    res.json({ data: zones });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function createDeliveryZone(req, res) {
  try {
    const { name, charge, estimatedDays } = req.body;

    const zone = await prisma.deliveryConfig.create({
      data: {
        name,
        charge: parseFloat(charge),
        estimatedDays,
        isActive: true,
      },
    });

    res.status(201).json({ data: zone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateDeliveryZone(req, res) {
  try {
    const { id } = req.params;
    const { name, charge, estimatedDays } = req.body;

    const zone = await prisma.deliveryConfig.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(charge && { charge: parseFloat(charge) }),
        ...(estimatedDays && { estimatedDays }),
      },
    });

    res.json({ data: zone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function deleteDeliveryZone(req, res) {
  try {
    const { id } = req.params;

    await prisma.deliveryConfig.update({
      where: { id },
      data: { isActive: false },
    });

    res.json({ message: 'Delivery zone deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  getDeliveryZones,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
};
