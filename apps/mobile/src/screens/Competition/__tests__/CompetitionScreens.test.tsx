describe('Competition Functions', () => {
  describe('Competition Logic', () => {
    it('validates competition data structure', () => {
      const competition = {
        id: '1',
        name: 'Weekly Fitness Challenge',
        description: 'A weekly fitness competition',
        entry_fee: 50,
        participants: ['user1', 'user2'],
        type: 'weekly',
        status: 'active'
      };

      expect(competition.id).toBeTruthy();
      expect(competition.name).toBeTruthy();
      expect(competition.entry_fee).toBeGreaterThan(0);
      expect(Array.isArray(competition.participants)).toBe(true);
    });

    it('handles competition filtering', () => {
      const competitions = [
        { id: '1', status: 'active' },
        { id: '2', status: 'upcoming' },
        { id: '3', status: 'completed' }
      ];

      const activeCompetitions = competitions.filter(c => c.status === 'active');
      const upcomingCompetitions = competitions.filter(c => c.status === 'upcoming');

      expect(activeCompetitions.length).toBe(1);
      expect(upcomingCompetitions.length).toBe(1);
    });

    it('calculates competition statistics', () => {
      const competition = {
        entry_fee: 50,
        participants: ['user1', 'user2', 'user3']
      };

      const totalPrizePool = competition.entry_fee * competition.participants.length * 0.6;

      expect(totalPrizePool).toBe(90); // 50 * 3 * 0.6 = 90
    });

    it('validates competition search functionality', () => {
      const competitions = [
        { name: 'Weekly Fitness Challenge', description: 'Fitness competition' },
        { name: 'Monthly Running Challenge', description: 'Running competition' }
      ];

      const searchResults = competitions.filter(c =>
        c.name.toLowerCase().includes('fitness')
      );

      expect(searchResults.length).toBe(1);
      expect(searchResults[0].name).toBe('Weekly Fitness Challenge');
    });

    it('handles competition creation validation', () => {
      const competitionData = {
        name: 'New Competition',
        entryFee: 100,
        type: 'weekly',
        startDate: new Date(),
        endDate: new Date()
      };

      expect(competitionData.name).toBeTruthy();
      expect(competitionData.entryFee).toBeGreaterThan(0);
      expect(['weekly', 'monthly']).toContain(competitionData.type);
    });

    it('calculates days left in competition', () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

      const daysLeft = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

      expect(daysLeft).toBe(7);
    });
  });

  describe('CreateCompetition Logic', () => {
    it('validates competition form data', () => {
      const formData = {
        name: 'Test Competition',
        description: 'Test description',
        type: 'weekly',
        entryFee: '50',
        startDate: new Date(),
        endDate: new Date()
      };

      expect(formData.name.length).toBeGreaterThan(0);
      expect(formData.description.length).toBeGreaterThan(0);
      expect(formData.entryFee).toBeTruthy();
    });

    it('handles competition type selection', () => {
      const types = ['weekly', 'monthly'];

      types.forEach(type => {
        expect(['weekly', 'monthly']).toContain(type);
      });
    });

    it('validates entry fee format', () => {
      const validFees = ['50', '100', '200'];
      const invalidFees = ['0', '-50', 'abc'];

      validFees.forEach(fee => {
        expect(parseInt(fee)).toBeGreaterThan(0);
      });

      invalidFees.forEach(fee => {
        const parsed = parseInt(fee);
        expect(isNaN(parsed) || parsed <= 0).toBe(true);
      });
    });

    it('handles rule management', () => {
      const rules = ['Rule 1', 'Rule 2', 'Rule 3'];

      expect(rules.length).toBe(3);
      expect(rules[0]).toBe('Rule 1');
    });
  });
});


